import { PrismaClient, InvoiceStatus, PaymentMethod } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Helper function to safely get nested value
function getValue(obj: any): any {
  return obj?.value;
}

async function main() {
  console.log('🌱 Starting seed...');

  // Read JSON file
  const dataPath = path.join(__dirname, '../../../data/Analytics_Test_Data.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const data = JSON.parse(rawData);

  // Clear existing data
  await prisma.payment.deleteMany();
  await prisma.lineItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.customer.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create vendors and customers maps
  const vendorMap = new Map();
  const customerMap = new Map();

  let processedCount = 0;
  let skippedCount = 0;
  const invoiceNumberMap = new Map(); // Track invoice numbers to handle duplicates

  // Process invoices
  for (const item of data) {
    try {
      const llmData = item.extractedData?.llmData;
      
      if (!llmData) {
        console.warn(`⚠️  Skipping item ${item._id} - no llmData found`);
        skippedCount++;
        continue;
      }

      // Extract vendor data
      const vendorData = llmData.vendor?.value;
      const vendorName = getValue(vendorData?.vendorName);
      
      // Extract customer data
      const customerData = llmData.customer?.value;
      const customerName = getValue(customerData?.customerName);

      // Extract invoice data
      const invoiceData = llmData.invoice?.value;
      const invoiceId = getValue(invoiceData?.invoiceId);
      const invoiceDate = getValue(invoiceData?.invoiceDate);
      const deliveryDate = getValue(invoiceData?.deliveryDate);

      // Create unique invoice number (handle duplicates)
      let invoiceNumber = invoiceId || item._id;
      let counter = 1;
      const baseInvoiceNumber = invoiceNumber;
      while (invoiceNumberMap.has(invoiceNumber)) {
        invoiceNumber = `${baseInvoiceNumber}-${counter}`;
        counter++;
      }
      invoiceNumberMap.set(invoiceNumber, true);

      // Extract summary data
      const summaryData = llmData.summary?.value;
      const subTotal = getValue(summaryData?.subTotal) || 0;
      const totalTax = getValue(summaryData?.totalTax) || 0;
      const invoiceTotal = getValue(summaryData?.invoiceTotal) || 0;

      // Extract payment data
      const paymentData = llmData.payment?.value;
      const dueDate = getValue(paymentData?.dueDate);

      // Skip if essential data is missing
      if (!vendorName || !customerName) {
        console.warn(`⚠️  Skipping invoice ${invoiceId || item._id} - missing vendor or customer`);
        skippedCount++;
        continue;
      }

      // Create or get vendor
      let vendor = vendorMap.get(vendorName);
      if (!vendor) {
        const vendorAddress = getValue(vendorData?.vendorAddress) || '';
        const addressParts = vendorAddress.split(',').map((s: string) => s.trim());
        
        vendor = await prisma.vendor.create({
          data: {
            name: vendorName,
            email: null,
            phone: getValue(vendorData?.vendorPartyNumber) || null,
            address: addressParts[0] || null,
            city: addressParts[1] || null,
            state: null,
            country: addressParts[2] || null,
            postalCode: null,
            taxId: getValue(vendorData?.vendorTaxId) || null,
          },
        });
        vendorMap.set(vendorName, vendor);
      }

      // Create or get customer
      let customer = customerMap.get(customerName);
      if (!customer) {
        const customerAddress = getValue(customerData?.customerAddress) || '';
        const addressParts = customerAddress.split(',').map((s: string) => s.trim());
        
        customer = await prisma.customer.create({
          data: {
            name: customerName,
            email: null,
            phone: null,
            address: addressParts[0] || null,
            city: addressParts[1] || null,
            state: null,
            country: null,
            postalCode: null,
          },
        });
        customerMap.set(customerName, customer);
      }

      // Determine dates
      const parsedInvoiceDate = invoiceDate ? new Date(invoiceDate) : new Date();
      const parsedDueDate = dueDate ? new Date(dueDate) : deliveryDate ? new Date(deliveryDate) : new Date();

      // Determine status
      const isPaid = false; // We don't have payment status in this data
      const isOverdue = !isPaid && parsedDueDate < new Date();
      
      let status: InvoiceStatus = InvoiceStatus.PENDING;
      if (isPaid) status = InvoiceStatus.PAID;
      else if (isOverdue) status = InvoiceStatus.OVERDUE;

      // Create invoice
      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber: invoiceNumber,
          vendorId: vendor.id,
          customerId: customer.id,
          invoiceDate: parsedInvoiceDate,
          dueDate: parsedDueDate,
          subtotal: Math.abs(subTotal),
          tax: Math.abs(totalTax),
          total: Math.abs(invoiceTotal),
          status,
          category: getValue(summaryData?.documentType) || 'General',
          description: item.name || null,
        },
      });

      // Create line items
      const lineItemsData = llmData.lineItems?.value?.items?.value;
      if (lineItemsData && Array.isArray(lineItemsData)) {
        for (const lineItem of lineItemsData) {
          await prisma.lineItem.create({
            data: {
              invoiceId: invoice.id,
              description: getValue(lineItem.description) || 'Item',
              quantity: getValue(lineItem.quantity) || 1,
              unitPrice: Math.abs(getValue(lineItem.unitPrice) || 0),
              amount: Math.abs(getValue(lineItem.totalPrice) || 0),
              category: getValue(lineItem.Sachkonto)?.toString() || null,
            },
          });
        }
      }

      // Create payment if bank account info exists
      const bankAccount = getValue(paymentData?.bankAccountNumber);
      if (bankAccount) {
        await prisma.payment.create({
          data: {
            invoiceId: invoice.id,
            paymentDate: parsedDueDate,
            amount: Math.abs(invoiceTotal),
            paymentMethod: PaymentMethod.BANK_TRANSFER,
            reference: bankAccount,
            notes: null,
          },
        });
      }

      processedCount++;
      console.log(`✓ Processed invoice ${invoiceNumber}`);

    } catch (error) {
      console.error(`❌ Error processing item ${item._id}:`, error);
      skippedCount++;
    }
  }

  console.log('\n✅ Seed completed successfully!');
  console.log(`📊 Created ${vendorMap.size} vendors`);
  console.log(`👥 Created ${customerMap.size} customers`);
  console.log(`📄 Processed ${processedCount} invoices`);
  console.log(`⚠️  Skipped ${skippedCount} invoices`);
  console.log(`📋 Total items in file: ${data.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });