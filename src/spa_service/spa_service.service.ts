import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpaService } from './spa_service.Entity';
import { Repository } from 'typeorm';
import { CreateSpaServiceDto } from './dtos/createspa_service.dto';
import { UpdateSpaServiceDto } from './dtos/updatespa_service.dto';

@Injectable()
export class SpaServiceService {
    constructor(
        @InjectRepository(SpaService)
        private readonly spaServiceRepository: Repository<SpaService>,
      ) {}
    
      async getAllSpaService() {
        return this.spaServiceRepository.find();
      }
    
      async getAllSpaServiceById(id: number) {
        const spaService = await this.spaServiceRepository.findOne({ where: { id } });
        if (!spaService) {
          throw new NotFoundException(`SpaService  not found`);
        }
        return spaService;
      }

      async createSpaService(createSpaService: CreateSpaServiceDto) {
        const spaService = this.spaServiceRepository.create(createSpaService);
        return await this.spaServiceRepository.save(spaService);
      }
    
      async updateSpaService(id: number, updateSpaService: UpdateSpaServiceDto) {
        const spaService = await this.spaServiceRepository.preload({
          id,
          ...updateSpaService,
        });
    
        if (!spaService) {
          throw new NotFoundException(`SpaService with ID ${id} not found`);
        }
    
        return this.spaServiceRepository.save(spaService);
      }
    
      async deleteSpaService(id: number) {
        const result = await this.spaServiceRepository.delete(id);
        if (result.affected === 0) {
          throw new NotFoundException(`SpaService with ID ${id} not found`);
        }
      }
}
