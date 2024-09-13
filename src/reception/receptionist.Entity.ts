import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { FinalBilling } from "src/final_billing/final_billing.Entity";

@Entity('receptionist')
export class Receptionist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => FinalBilling, (finalBilling) => finalBilling.receptionist)
  finalBilling: FinalBilling;

}
