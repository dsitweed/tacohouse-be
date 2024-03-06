import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommonService } from './common.service';

@Controller('common')
@ApiTags('Common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get('province')
  getListProvince() {
    return this.commonService.getListProvince();
  }

  @Get('district/:provinceCode')
  getListDistrict(@Param('provinceCode') provinceCode: string) {
    return this.commonService.getListDistrict(provinceCode);
  }

  @Get('ward/:districtCode')
  getListWard(@Param('districtCode') districtCode: string) {
    return this.commonService.getListWard(districtCode);
  }

  @Get('facility-types')
  getListFacilityType() {
    return this.commonService.getListFacilityType();
  }
}
