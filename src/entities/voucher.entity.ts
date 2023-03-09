import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EventEntity } from "./event.entity";

@Entity({ name: "vouchers" })
@ObjectType()
export class VoucherEntity extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column({ nullable: false })
  code: string;

  @ManyToOne(() => EventEntity, (event: EventEntity) => event.vouchers, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "event_id" })
  event: EventEntity;
}
