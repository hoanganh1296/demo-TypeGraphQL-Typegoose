import { InputType,Field } from "type-graphql";

@InputType()
export class CreateVoucherInput{
    @Field()
    eventId:string;
}
