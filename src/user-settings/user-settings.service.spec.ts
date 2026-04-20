import { Test, TestingModule } from '@nestjs/testing';
import { UserSettingsService } from './user-settings.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserSettingsService', () => {
  let service: UserSettingsService;

  beforeEach(async () => {
    const prismaService = {
      userSettings: {
        upsert: jest.fn(),
        update: jest.fn(),
      },
      character: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserSettingsService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<UserSettingsService>(UserSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
