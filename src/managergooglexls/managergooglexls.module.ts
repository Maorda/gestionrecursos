import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DynamicModule } from '@nestjs/common';
import { GoogleDriveConfig } from './types/google.config.service';
import { GoogleAuthService, IGoogleXlsConfig } from './services/google.auth.service';
import { GoogleXlsxService } from './services/google.manager.xls.service';
@Module({
    imports: [HttpModule],
})
export class ManagergooglexlsModule {
 /**
 *
 * @param googleDriveConfig your config file/all config fields
 */
static register(
    googleDriveConfig: GoogleDriveConfig,
    sheetIdAlmacen:string,
    sheetIdPersonal:string

  ): DynamicModule {
    return {
      module: ManagergooglexlsModule,
      global: true,
      providers: [
        GoogleAuthService,
        GoogleXlsxService,
        { provide: "CONFIG", useValue: googleDriveConfig },
        { provide: "SHEETIDALMACEN", useValue:sheetIdAlmacen},
        { provide: "SHEETIDPERSONAL", useValue:sheetIdPersonal}
      ],
      exports: [
        GoogleAuthService,
        GoogleXlsxService,
        { provide: "CONFIG", useValue: googleDriveConfig },
        { provide: "SHEETIDALMACEN", useValue:sheetIdAlmacen},
        { provide: "SHEETIDPERSONAL", useValue:sheetIdPersonal}
      ],
    };
  }
}
