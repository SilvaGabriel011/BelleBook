import { PrismaClient, Booking } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes antes de criar novos
  console.log('🗑️  Limpando dados existentes...');
  await prisma.review.deleteMany();
  await prisma.reminder.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Dados limpos!');

  // Criar contas demo com diferentes roles
  const hashedPassword = await bcrypt.hash('senha123', 10);

  // 1. Admin Demo
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@bellebook.com',
      password: hashedPassword,
      name: 'Administradora Belle',
      phone: '11999999991',
      role: 'ADMIN',
      points: 0,
    },
  });

  // Create admin profile
  await prisma.adminProfile.create({
    data: {
      userId: adminUser.id,
      permissions: JSON.stringify([
        'VIEW_USERS',
        'EDIT_USERS',
        'DELETE_USERS',
        'SUSPEND_USERS',
        'VIEW_EMPLOYEES',
        'APPROVE_EMPLOYEES',
        'EDIT_EMPLOYEES',
        'VIEW_ALL_BOOKINGS',
        'EDIT_BOOKINGS',
        'CANCEL_BOOKINGS',
        'MANAGE_SERVICES',
        'VIEW_ALL_CHATS',
        'VIEW_ANALYTICS',
        'EXPORT_REPORTS',
        'MANAGE_SETTINGS',
        'MANAGE_ADMINS',
      ]),
      department: 'TI',
      isSuperAdmin: true,
    },
  });

  // 2. Cliente Demo
  const clientUser = await prisma.user.create({
    data: {
      email: 'cliente@bellebook.com',
      password: hashedPassword,
      name: 'Maria Cliente',
      phone: '11999999992',
      role: 'CUSTOMER',
      points: 150,
      birthDate: new Date('1995-05-15'),
    },
  });

  // 3. Funcionária Demo
  const employeeUser = await prisma.user.create({
    data: {
      email: 'funcionaria@bellebook.com',
      password: hashedPassword,
      name: 'Ana Funcionária',
      phone: '11999999993',
      role: 'EMPLOYEE',
      points: 50,
    },
  });

  // 4. Cliente VIP Demo (com mais pontos)
  const vipUser = await prisma.user.create({
    data: {
      email: 'vip@bellebook.com',
      password: hashedPassword,
      name: 'Juliana VIP',
      phone: '11999999994',
      role: 'CUSTOMER',
      points: 500,
      birthDate: new Date('1990-10-20'),
    },
  });

  console.log('✅ Contas demo criadas:');
  console.log('  - Admin:', adminUser.email);
  console.log('  - Cliente:', clientUser.email);
  console.log('  - Funcionária:', employeeUser.email);
  console.log('  - VIP:', vipUser.email);

  // Criar categorias
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Sobrancelha',
        description: 'Design, micropigmentação e tratamentos para sobrancelhas',
        icon: 'Eye',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Unha',
        description: 'Manicure, pedicure, nail art e alongamento',
        icon: 'Palette',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Cabelo',
        description: 'Cortes, coloração, tratamentos e penteados',
        icon: 'Scissors',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Depilação',
        description: 'Depilação a laser, cera e outros métodos',
        icon: 'Sparkles',
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Categorias criadas:', categories.length);

  // Criar serviços para cada categoria
  const servicesData = [
    // Sobrancelha
    {
      categoryId: categories[0].id,
      name: 'Design de Sobrancelha',
      description: 'Design personalizado com pinça e tesoura',
      duration: 45,
      price: 65.0,
      promoPrice: 52.0,
    },
    {
      categoryId: categories[0].id,
      name: 'Micropigmentação',
      description: 'Micropigmentação fio a fio realista',
      duration: 120,
      price: 350.0,
      promoPrice: 280.0,
    },
    {
      categoryId: categories[0].id,
      name: 'Henna',
      description: 'Aplicação de henna para sobrancelhas',
      duration: 30,
      price: 35.0,
      promoPrice: null,
    },
    // Unha
    {
      categoryId: categories[1].id,
      name: 'Manicure Tradicional',
      description: 'Manicure completa com esmaltação',
      duration: 60,
      price: 45.0,
      promoPrice: 36.0,
    },
    {
      categoryId: categories[1].id,
      name: 'Pedicure Completa',
      description: 'Pedicure com esfoliação e hidratação',
      duration: 75,
      price: 55.0,
      promoPrice: 44.0,
    },
    {
      categoryId: categories[1].id,
      name: 'Alongamento em Gel',
      description: 'Alongamento de unhas com gel moldado',
      duration: 120,
      price: 120.0,
      promoPrice: 96.0,
    },
    {
      categoryId: categories[1].id,
      name: 'Nail Art',
      description: 'Decoração artística nas unhas',
      duration: 30,
      price: 25.0,
      promoPrice: null,
    },
    // Cabelo
    {
      categoryId: categories[2].id,
      name: 'Corte Feminino',
      description: 'Corte personalizado com lavagem e secagem',
      duration: 60,
      price: 80.0,
      promoPrice: 64.0,
    },
    {
      categoryId: categories[2].id,
      name: 'Coloração',
      description: 'Coloração completa com produtos de qualidade',
      duration: 150,
      price: 180.0,
      promoPrice: 144.0,
    },
    {
      categoryId: categories[2].id,
      name: 'Hidratação Profunda',
      description: 'Tratamento de hidratação com máscara profissional',
      duration: 90,
      price: 95.0,
      promoPrice: 76.0,
    },
    {
      categoryId: categories[2].id,
      name: 'Escova Progressiva',
      description: 'Alisamento progressivo sem formol',
      duration: 180,
      price: 250.0,
      promoPrice: null,
    },
    // Depilação
    {
      categoryId: categories[3].id,
      name: 'Depilação Axilas',
      description: 'Depilação completa das axilas com cera',
      duration: 20,
      price: 30.0,
      promoPrice: 24.0,
    },
    {
      categoryId: categories[3].id,
      name: 'Depilação Pernas Completas',
      description: 'Depilação de pernas inteiras com cera',
      duration: 60,
      price: 75.0,
      promoPrice: 60.0,
    },
    {
      categoryId: categories[3].id,
      name: 'Depilação Virilha Completa',
      description: 'Depilação íntima completa com cera',
      duration: 45,
      price: 65.0,
      promoPrice: 52.0,
    },
    {
      categoryId: categories[3].id,
      name: 'Laser Axilas (Sessão)',
      description: 'Sessão de depilação a laser para axilas',
      duration: 15,
      price: 90.0,
      promoPrice: null,
    },
  ];

  const services = await Promise.all(
    servicesData.map((service) =>
      prisma.service.create({
        data: {
          ...service,
          images: JSON.stringify(['/placeholder.jpg']), // Array como JSON
          isActive: true,
        },
      }),
    ),
  );

  console.log('✅ Serviços criados:', services.length);

  // Criar múltiplos agendamentos de exemplo
  const bookings: Booking[] = [];

  // Agendamento futuro confirmado - Cliente
  const booking1 = await prisma.booking.create({
    data: {
      userId: clientUser.id,
      serviceId: services[0].id, // Design de Sobrancelha
      date: new Date('2024-11-20T14:00:00'),
      time: '14:00',
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      totalPaid: services[0].promoPrice || services[0].price,
      notes: 'Primeira visita',
    },
  });
  bookings.push(booking1);

  // Agendamento futuro pendente - Cliente VIP
  const booking2 = await prisma.booking.create({
    data: {
      userId: vipUser.id,
      serviceId: services[5].id, // Alongamento em Gel
      date: new Date('2024-11-22T16:00:00'),
      time: '16:00',
      status: 'PENDING',
      paymentStatus: 'PENDING',
      totalPaid: services[5].promoPrice || services[5].price,
      notes: 'Prefiro unhas mais naturais',
    },
  });
  bookings.push(booking2);

  // Agendamento completado - Cliente VIP
  const booking3 = await prisma.booking.create({
    data: {
      userId: vipUser.id,
      serviceId: services[3].id, // Manicure Tradicional
      date: new Date('2024-11-10T10:00:00'),
      time: '10:00',
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      totalPaid: services[3].promoPrice || services[3].price,
      notes: 'Cliente frequente',
    },
  });
  bookings.push(booking3);

  // Agendamento completado - Cliente
  const booking4 = await prisma.booking.create({
    data: {
      userId: clientUser.id,
      serviceId: services[7].id, // Corte Feminino
      date: new Date('2024-11-05T15:00:00'),
      time: '15:00',
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      totalPaid: services[7].promoPrice || services[7].price,
    },
  });
  bookings.push(booking4);

  console.log('✅ Agendamentos criados:', bookings.length);

  // Criar reviews para agendamentos completados
  await prisma.review.create({
    data: {
      userId: vipUser.id,
      serviceId: services[3].id,
      bookingId: booking3.id,
      rating: 5,
      comment:
        'Adorei o atendimento! Profissional muito atenciosa e o resultado ficou perfeito. Com certeza voltarei!',
    },
  });

  await prisma.review.create({
    data: {
      userId: clientUser.id,
      serviceId: services[7].id,
      bookingId: booking4.id,
      rating: 4,
      comment: 'Muito bom! Corte exatamente como eu queria.',
    },
  });

  console.log('✅ Reviews criadas');

  // Criar notificações
  await prisma.notification.create({
    data: {
      userId: clientUser.id,
      type: 'BOOKING_REMINDER',
      title: 'Lembrete de Agendamento',
      message:
        'Você tem um agendamento em 2 dias: Design de Sobrancelha às 14:00',
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: vipUser.id,
      type: 'PROMOTION',
      title: 'Promoção Especial! 🎉',
      message: 'Você ganhou 20% de desconto no próximo serviço de cabelo!',
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: clientUser.id,
      type: 'REVIEW_REQUEST',
      title: 'Avalie seu atendimento',
      message: 'Como foi sua experiência com o Corte Feminino?',
      isRead: true,
    },
  });

  console.log('✅ Notificações criadas');

  // Adicionar favoritos
  await prisma.service.update({
    where: { id: services[0].id },
    data: {
      favoritedBy: {
        connect: [{ id: clientUser.id }, { id: vipUser.id }],
      },
    },
  });

  await prisma.service.update({
    where: { id: services[5].id },
    data: {
      favoritedBy: {
        connect: { id: vipUser.id },
      },
    },
  });

  console.log('✅ Favoritos adicionados');

  console.log('🎉 Seed concluído com sucesso!');
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('📝 CONTAS DEMO CRIADAS');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log('👑 ADMINISTRADORA:');
  console.log('   Email: admin@bellebook.com');
  console.log('   Senha: senha123');
  console.log('   Role: ADMIN');
  console.log('');
  console.log('👤 CLIENTE:');
  console.log('   Email: cliente@bellebook.com');
  console.log('   Senha: senha123');
  console.log('   Role: CUSTOMER');
  console.log('   Pontos: 150');
  console.log('');
  console.log('💼 FUNCIONÁRIA:');
  console.log('   Email: funcionaria@bellebook.com');
  console.log('   Senha: senha123');
  console.log('   Role: EMPLOYEE');
  console.log('   Pontos: 50');
  console.log('');
  console.log('⭐ CLIENTE VIP:');
  console.log('   Email: vip@bellebook.com');
  console.log('   Senha: senha123');
  console.log('   Role: CUSTOMER');
  console.log('   Pontos: 500');
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('📊 ESTATÍSTICAS:');
  console.log(`   ${categories.length} Categorias`);
  console.log(`   ${services.length} Serviços`);
  console.log(`   ${bookings.length} Agendamentos`);
  console.log(`   2 Reviews`);
  console.log('═══════════════════════════════════════════════════════');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
