
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  detectRuntime,
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.7.1
 * Query Engine version: 0ca5ccbcfa6bdc81c003cf549abe4269f59c41e5
 */
Prisma.prismaVersion = {
  client: "5.7.1",
  engine: "0ca5ccbcfa6bdc81c003cf549abe4269f59c41e5"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  throw new Error(`Extensions.getExtensionContext is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.defineExtension = () => {
  throw new Error(`Extensions.defineExtension is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.PersonnesScalarFieldEnum = {
  id: 'id',
  name: 'name',
  role: 'role',
  signature: 'signature',
  conflitId: 'conflitId',
  visiteTerrainId: 'visiteTerrainId'
};

exports.Prisma.SignatureScalarFieldEnum = {
  id: 'id',
  date: 'date',
  present: 'present',
  memberId: 'memberId',
  rencontreId: 'rencontreId'
};

exports.Prisma.FilesScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  url: 'url',
  size: 'size',
  visiteTerrainId: 'visiteTerrainId',
  conflitId: 'conflitId',
  rencontreId: 'rencontreId'
};

exports.Prisma.UsersScalarFieldEnum = {
  id: 'id',
  authId: 'authId',
  profile: 'profile',
  name: 'name',
  email: 'email',
  phone: 'phone',
  address: 'address',
  gender: 'gender',
  dob: 'dob',
  filesId: 'filesId',
  status: 'status',
  type: 'type',
  routes: 'routes',
  access: 'access',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProjectScalarFieldEnum = {
  id: 'id',
  name: 'name',
  status: 'status',
  local: 'local',
  startDate: 'startDate',
  endDate: 'endDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LeaveScalarFieldEnum = {
  id: 'id',
  date: 'date',
  reason: 'reason',
  projectId: 'projectId',
  memberId: 'memberId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AccompanimentScalarFieldEnum = {
  id: 'id',
  name: 'name',
  adresse: 'adresse',
  phones: 'phones',
  budget: 'budget',
  status: 'status',
  usersid: 'usersid',
  fileId: 'fileId',
  projectId: 'projectId',
  planningId: 'planningId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ClasseScalarFieldEnum = {
  id: 'id',
  name: 'name',
  usersId: 'usersId',
  projectId: 'projectId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MemberScalarFieldEnum = {
  id: 'id',
  projectId: 'projectId',
  profile: 'profile',
  name: 'name',
  phone: 'phone',
  gender: 'gender',
  dob: 'dob',
  commune: 'commune',
  residential: 'residential',
  disability: 'disability',
  language: 'language',
  attestation: 'attestation',
  accompanimentId: 'accompanimentId',
  classeId: 'classeId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ChatScalarFieldEnum = {
  id: 'id',
  projectId: 'projectId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ChatParticipantScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  chatId: 'chatId',
  joinedAt: 'joinedAt'
};

exports.Prisma.MessageScalarFieldEnum = {
  id: 'id',
  content: 'content',
  sentAt: 'sentAt',
  senderId: 'senderId',
  chatId: 'chatId'
};

exports.Prisma.MessageViewScalarFieldEnum = {
  id: 'id',
  view: 'view',
  messageId: 'messageId',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VisitsScalarFieldEnum = {
  id: 'id',
  date: 'date',
  startTime: 'startTime',
  endTime: 'endTime',
  status: 'status',
  location: 'location',
  objetif: 'objetif',
  planningId: 'planningId'
};

exports.Prisma.PlanningScalarFieldEnum = {
  id: 'id',
  usersId: 'usersId'
};

exports.Prisma.MapsScalarFieldEnum = {
  id: 'id',
  accompanimentId: 'accompanimentId',
  latitude: 'latitude',
  longitude: 'longitude',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PurchaseItemsScalarFieldEnum = {
  id: 'id',
  name: 'name',
  price: 'price',
  image: 'image',
  quantity: 'quantity',
  date: 'date',
  purchaseId: 'purchaseId'
};

exports.Prisma.PurchaseScalarFieldEnum = {
  id: 'id',
  total: 'total',
  accompanimentId: 'accompanimentId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EmargementScalarFieldEnum = {
  id: 'id',
  date: 'date',
  signature: 'signature',
  cni: 'cni',
  PhotoCni: 'PhotoCni',
  montant: 'montant',
  observations: 'observations',
  usersId: 'usersId',
  memberId: 'memberId'
};

exports.Prisma.VisiteTerrainScalarFieldEnum = {
  id: 'id',
  visitId: 'visitId',
  observations: 'observations',
  usersId: 'usersId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ConflitScalarFieldEnum = {
  id: 'id',
  nature: 'nature',
  resolution: 'resolution',
  usersId: 'usersId',
  status: 'status',
  accompanimentId: 'accompanimentId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RencontreScalarFieldEnum = {
  id: 'id',
  date: 'date',
  lieu: 'lieu',
  order: 'order',
  decisions: 'decisions',
  actions: 'actions',
  accompanimentId: 'accompanimentId',
  usersId: 'usersId'
};

exports.Prisma.UploadScalarFieldEnum = {
  id: 'id',
  titre: 'titre',
  date: 'date',
  fileId: 'fileId',
  userId: 'userId'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.Status = exports.$Enums.Status = {
  enabled: 'enabled',
  disabled: 'disabled'
};

exports.Type = exports.$Enums.Type = {
  admin: 'admin',
  employe: 'employe',
  accompanist: 'accompanist',
  trainer: 'trainer'
};

exports.Prisma.ModelName = {
  Personnes: 'Personnes',
  Signature: 'Signature',
  Files: 'Files',
  Users: 'Users',
  Project: 'Project',
  Leave: 'Leave',
  Accompaniment: 'Accompaniment',
  Classe: 'Classe',
  Member: 'Member',
  Chat: 'Chat',
  ChatParticipant: 'ChatParticipant',
  Message: 'Message',
  MessageView: 'MessageView',
  Visits: 'Visits',
  Planning: 'Planning',
  Maps: 'Maps',
  PurchaseItems: 'PurchaseItems',
  Purchase: 'Purchase',
  Emargement: 'Emargement',
  VisiteTerrain: 'VisiteTerrain',
  Conflit: 'Conflit',
  Rencontre: 'Rencontre',
  Upload: 'Upload'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        const runtime = detectRuntime()
        const edgeRuntimeName = {
          'workerd': 'Cloudflare Workers',
          'deno': 'Deno and Deno Deploy',
          'netlify': 'Netlify Edge Functions',
          'edge-light': 'Vercel Edge Functions',
        }[runtime]

        let message = 'PrismaClient is unable to run in '
        if (edgeRuntimeName !== undefined) {
          message += edgeRuntimeName + '. As an alternative, try Accelerate: https://pris.ly/d/accelerate.'
        } else {
          message += 'this browser environment, or has been bundled for the browser (running in `' + runtime + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://github.com/prisma/prisma/issues`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
