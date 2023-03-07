import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { VoucherEntity } from "./voucher.entity";

@Entity({ name: "events" })
@ObjectType()
export class EventEntity extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column({ nullable: false })
  title: string;

  @Field(() => Number)
  @Column({ default: 10 })
  maxVoucher: number;

  @Field(() => Number)
  @Column({ default: 0 })
  quantityCreated: number;

  @OneToMany(() => VoucherEntity, (voucher: VoucherEntity) => voucher.event, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  vouchers: Promise<Array<VoucherEntity>>;
}
