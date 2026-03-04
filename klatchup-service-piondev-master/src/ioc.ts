import { Container, decorate, injectable } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import { Controller } from "tsoa";
import { ProfileRepository } from "./api/profiles/ProfileRepository";
import { ProfileRepositoryDynamoDB } from "./api/profiles/ProfileRepositoryDynamoDB";

const iocContainer = new Container();

decorate(injectable(), Controller);

iocContainer.load(buildProviderModule());

iocContainer.bind<ProfileRepository>("ProfileRepository").toConstantValue(new ProfileRepositoryDynamoDB());

export { iocContainer };
