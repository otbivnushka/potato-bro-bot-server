import { Test, TestingModule } from '@nestjs/testing';
import { UserSettingsController } from './user-settings.controller';
import { UserSettingsService } from './user-settings.service';

describe('UserSettingsController', () => {
  let controller: UserSettingsController;

  beforeEach(async () => {
    const userSettingsService = {
      findOne: jest.fn(),
      updateTheme: jest.fn(),
      updateCharacter: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserSettingsController],
      providers: [
        {
          provide: UserSettingsService,
          useValue: userSettingsService,
        },
      ],
    }).compile();

    controller = module.get<UserSettingsController>(UserSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
