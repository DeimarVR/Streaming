import { PrismaClient, Role, InstitutionType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('demo1234', 10);

  const institution = await prisma.institution.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      name: 'Institución Demo',
      slug: 'demo',
      type: InstitutionType.COLEGIO,
      branding: { brand: '#5B8CFF', grad1: '#6D5CF6', grad2: '#4F8BF7' },
    },
  });

  const mk = (email: string, name: string, role: Role, color?: string) =>
    prisma.user.upsert({
      where: { institutionId_email: { institutionId: institution.id, email } },
      update: {},
      create: { institutionId: institution.id, email, name, role, color, passwordHash },
    });

  await mk('admin@institucion.edu', 'Jorge Peláez', Role.ADMIN, '#E0813B');
  const teacher = await mk('docente@institucion.edu', 'Marcela Ríos', Role.TEACHER, '#1F9E6E');
  const student = await mk('estudiante@institucion.edu', 'Sofía Martínez', Role.STUDENT, '#B4438F');
  await mk('acudiente@institucion.edu', 'Carmen Díaz', Role.GUARDIAN, '#B4438F');

  const course = await prisma.course.create({
    data: {
      institutionId: institution.id,
      name: 'Business English',
      subject: 'Inglés',
      level: 'B1',
      teacherId: teacher.id,
    },
  });

  await prisma.enrollment.upsert({
    where: { courseId_studentId: { courseId: course.id, studentId: student.id } },
    update: {},
    create: { courseId: course.id, studentId: student.id },
  });

  console.log('Seed listo: institución demo + usuarios (contraseña: demo1234).');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
