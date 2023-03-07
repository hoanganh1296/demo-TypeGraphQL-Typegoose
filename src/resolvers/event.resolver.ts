import { Query, Resolver } from "type-graphql";
import { EventEntity } from "../entity/event.entity";

@Resolver()
export default class EventResolver{
    @Query(()=>[EventEntity])
    events(){
        return EventEntity.find()
    }

    @Query(()=>EventEntity)
    event(){
        return EventEntity.find()
    }
}
