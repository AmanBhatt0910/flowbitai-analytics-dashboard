import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  console.log('📊 Database Verification\n');

  // Count records
  const vendorCount = await prisma.vendor.count();
  const customerCount = await prisma.customer.count();
  const invoiceCount = await prisma.invoice.count();
  const lineItemCount = await prisma.lineItem.count();
  const paymentCount = await prisma.payment.count();

  console.log('📈 Record Counts:');
  console.log(`   Vendors: ${vendorCount}`);
  console.log(`   Customers: ${customerCount}`);
  console.log(`   Invoices: ${invoiceCount}`);
  console.log(`   Line Items: ${lineItemCount}`);
  console.log(`   Payments: ${paymentCount}\n`);

  // Sample data
  console.log('🔍 Sample Invoices:');
  const sampleInvoices = await prisma.invoice.findMany({
    take: 5,
    include: {
      vendor: true,
      customer: true,
      lineItems: true,
    },
  });

  sampleInvoices.forEach((invoice, idx) => {
    console.log(`\n${idx + 1}. Invoice #${invoice.invoiceNumber}`);
    console.log(`   Vendor: ${invoice.vendor.name}`);
    console.log(`   Customer: ${invoice.customer.name}`);
    console.log(`   Total: $${invoice.total}`);
    console.log(`   Status: ${invoice.status}`);
    console.log(`   Line Items: ${invoice.lineItems.length}`);
  });

  // Aggregations
  console.log('\n💰 Financial Summary:');
  const totals = await prisma.invoice.aggregate({
    _sum: {
      total: true,
      subtotal: true,
      tax: true,
    },
    _avg: {
      total: true,
    },
  });

  console.log(`   Total Revenue: $${totals._sum.total?.toFixed(2)}`);
  console.log(`   Total Subtotal: $${totals._sum.subtotal?.toFixed(2)}`);
  console.log(`   Total Tax: $${totals._sum.tax?.toFixed(2)}`);
  console.log(`   Average Invoice: $${totals._avg.total?.toFixed(2)}`);

  // Status breakdown
  console.log('\n📋 Invoice Status Breakdown:');
  const statuses = await prisma.invoice.groupBy({
    by: ['status'],
    _count: true,
  });

  statuses.forEach((status) => {
    console.log(`   ${status.status}: ${status._count} invoices`);
  });

  // Top vendors
  console.log('\n🏆 Top 5 Vendors by Invoice Count:');
  const topVendors = await prisma.vendor.findMany({
    include: {
      _count: {
        select: { invoices: true },
      },
    },
    orderBy: {
      invoices: {
        _count: 'desc',
      },
    },
    take: 5,
  });

  topVendors.forEach((vendor, idx) => {
    console.log(`   ${idx + 1}. ${vendor.name} - ${vendor._count.invoices} invoices`);
  });
}

verify()
  .catch((e) => {
    console.error('❌ Verification failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });