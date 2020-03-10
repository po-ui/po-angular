import { PoStorageModule } from './po-storage.module';
import { PO_STORAGE_CONFIG_TOKEN, PoStorageService } from './services/po-storage.service';

describe('PoStorageModule:', () => {
  let moduleDefinition;

  beforeEach(() => {
    moduleDefinition = {
      ngModule: PoStorageModule,
      providers: [
        {
          provide: PO_STORAGE_CONFIG_TOKEN,
          useValue: undefined
        },
        {
          provide: PoStorageService,
          useFactory: PoStorageService.providePoStorage,
          deps: [PO_STORAGE_CONFIG_TOKEN]
        }
      ]
    };
  });

  describe('Methods:', () => {
    it('forRoot: should return a module definition with default config if no set a storageConfig param', () => {
      moduleDefinition.providers[0].useValue = PoStorageService.getDefaultConfig();

      expect(PoStorageModule.forRoot()).toEqual(moduleDefinition);
    });

    it('forRoot: should return a module definition with param config if set a storageConfig param', () => {
      const configParam = {
        name: '_poTest',
        storeName: '_poStorage',
        driverOrder: ['indexeddb', 'websql', 'localstorage']
      };
      moduleDefinition.providers[0].useValue = configParam;

      expect(PoStorageModule.forRoot(configParam)).toEqual(moduleDefinition);
    });
  });
});
