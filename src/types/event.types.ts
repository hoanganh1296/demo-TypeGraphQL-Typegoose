import { InputType, Field, ObjectType } from "type-graphql";
import { Max, Min, IsNumber } from "class-validator";

@InputType()
export class CreateEventInput {
  @Field(() => String)
  title: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  @Field(() => Number)
  maxVoucher: number;
}

@InputType()
export class UpdateEventInput {
  @Field()
  eventId: string;

  @Field(() => String)
  title: string;

  @IsNumber()
  @Min(1)
  @Max(100)

  
  @Field(() => Number)
  maxVoucher: number;
}

@InputType()
export class GetEventInput {
  @Field()
  eventId: string;
}

@InputType()
export class DeleteEventInput {
  @Field()
  eventId: string;
}

@ObjectType()
export class DeleteEventResponse {
  @Field()
  message: string;
}
