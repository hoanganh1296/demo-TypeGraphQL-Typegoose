import { InputType,Field } from "type-graphql";

@InputType()
export class CreateEventInput{
    @Field(() => String)
    title?: string;
  
    @Field(()=>Number)
    maxVoucher?: number;
}
