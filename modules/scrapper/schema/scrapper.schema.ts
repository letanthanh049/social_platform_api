import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({
    collection: 'scrapper',
    timestamps: {createdAt: 'createdAt'},
    versionKey: false
})
export class Scrapper extends Document {
    @Prop({require: true})
    provider: string;

    @Prop({ type: mongoose.Schema.Types.Mixed })
    metadata: any
}

export const ScrapperSchema = SchemaFactory.createForClass(Scrapper);