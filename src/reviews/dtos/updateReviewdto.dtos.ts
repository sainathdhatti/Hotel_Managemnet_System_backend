import { PartialType } from "@nestjs/mapped-types";
import { CreateReviewDto } from "./createReviewdto.dtos";

export class UpdateReviewDto  extends PartialType(CreateReviewDto) {}