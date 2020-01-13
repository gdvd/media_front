interface MyMediaInfo {
  state: number,
  editTypeName: number,
  search: number,
  idMyMediaInfo: string,
  format: string,
  codecId: string,
  fileSize: number,
  duration: number,
  height: number,
  width: number,
  bitrate: number,
  typeMmi: TypeMmi,
  videoSupportPaths: VideoSupportPaths[],
  myMediaAudios: MyMediaAudio[],
  myMediaComments: MyMediaComment[],
  myMediaTexts: MyMediaText[],
  myMediaVideos: [],
  myressearch: ResultSearch[]
}
interface MyMediaComment{
  idMyMediaComment: number,
  mediaComment: string
}

interface MyPage {
  content: MyMediaInfo[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  sort: object;
  pageable: object;
  size: number;
  totalElements: number;
  totalPages: number
}

interface VideoSupportPaths {
  active: boolean;
  dateModif: string;
  id: Idvsp;
  id_video_name_export: number;
  pathGeneral: string;
  title: string;
  type: string
}

interface Idvsp {
  idMyMediainfo: string;
  idVideoNameExport: number;
  title: string;
  pathGeneral: string
}

interface MyMediaAudio {
  bitrate: number,
  duration: number,
  format: string,
  channels: string,
  forced: boolean,
  myMediaLanguage: MyMediaLanguage
}

/*interface MyMediaLanguage {
  idLanguage: number
  language: string
}*/

interface MyMediaLanguage {
  idLanguage: number
  language: string
}

interface MyMediaText {
  id: object,
  codecId: string,
  format: string,
  internal: boolean,
  myMediaLanguage: MyMediaLanguage
}

interface ResultSearch {
  info: string,
  state: boolean,
  link: string,
  name: string,
  urlImg: string,
  video: boolean
}

interface TypeMmi {
  idTypeMmi: number,
  season: number,
  episode: number,
  nameSerie: string,
  nameSerieVO: string,
  typeName: TypeName,
  videoFilm: VideoFilms,
  myMediaInfo: MyMediaInfo
}

interface TypeName {
  idTypeName: number,
  typeName: string,
  typeMmis: TypeMmi[]
}

interface VideoFilms {
  year: number,
  duration: number,
  scoreOnHundred: number,
  nbOfVote: number,
  idVideo: string,
  dateModifFilm: string,
  videoMoreInformation: VideoMoreInformation,
  typeMmi: TypeMmi
  videoComment: VideoComment,
  videoSerie: VideoSerie,
  videoSourceInfo: VideoSourceInfo,
  videoPosters: VideoPoster[];
  videoTrailler: VideoTrailler[],
  videoResumes: VideoResume[],
  videoTitles: VideoTitle[],
  videoUserScores: VideoUserScore[],
  videoKinds: VideoKind[],
  videoLanguages: VideoLanguages[],
  videoCountries: VideoCountry[],
  videoKeywordSet: VideoKeyword[],
  videoFilmArtists: VideoFilmArtist[],
  remake: Remake,
  children: VideoFilms[],
  editTypeName:number
}
interface Remake{
  active: boolean;
  idVideo: string,
  remakes: string[];
  titles: string[]
}
interface TitileWithIdttt{
  idtt: string,
  title: string
}

interface VideoMoreInformation {
  informap: object[];
}

interface VideoPoster {
  idPoster: number,
  fileName: string,
  idMd5poster: string,
  urlImg: string
}

interface VideoKind {
  idKind: number,
  kindEn: string,
  kindFr: string,
}

interface VideoLanguages {
  idVideoLanguage: number,
  language: string,
  urlLanguage: string
}

interface VideoCountry {
  idCountry: number,
  country: string,
  urlCountry: string
}

interface VideoKeyword {
  idKeword: number,
  keywordEn: string,
  keywordFr: string,
}

interface VideoTitle {
  id: IdVideoTitle,
  title: string
}

interface IdVideoTitle {
  idCountry: number,
  idVideo: string,
}

interface VideoTrailler {
  idTrailler: number,
  trailler: string
}

interface VideoUserScore {
  id :{
    idVideo: string,
    idMyUser: number,
  }
  idVideo: string,
  idMyUser: number,
  dateModifScoreUser: string,
  noteOnHundred: number,
  commentScoreUser: CommentUserScore,
}

interface CommentUserScore {
  idCommentScoreUser: number,
  comment: string
}

interface VideoMoreInformation {

}

interface VideoComment {
  idComment: number,
  comment: string,
}

interface VideoResume {
  idResume: number,
  textResume: string
}

interface VideoSerie {

}

interface VideoSourceInfo {

}

interface VideoFilmArtist {
  id:
    {
      idVideoArtist: string,
      idVideoFilm: string
    }

  idVideoArtist: string,
  idVideoFilm: string,
  actor: boolean,
  director: boolean,
  music: boolean,
  producer: boolean,
  writer: boolean,
  numberOrderActor: number
  videoArtist: videoArtist,
}

interface videoArtist {
  idVideoArtist: string,
  firstLastName: string
}

interface OneSimpleScore {
  idVideoFilm: string,
  title: string,
  score: number,
  nbOfVote: number,
  actorPos: number,
  dateModif: string,
  comment: string,

}

interface PreferencesSubscribe {
  id: number;
  idToSub: string;
  name: string;
  active: boolean,
  valueMin: number;
  valueMax: number;
  nbOfresultMin: number;
  nbOfresultMax: number;
  dateModif: Date;
}

interface PreferenceSubscribeWithScore {
  preferencesSubscribe: PreferencesSubscribe,
  dateask: number,
  total: number,
  dateModif: Date,
  datePrevious: Date,
  lsimplescores: OneSimpleScore[],

}

interface Onetitle {
  title: string,
  namevne: string
}

interface OnePath {
  pa;
  active: boolean;
}

interface Vnelight {
  idVideoNameExport: number;
  nameExport: string;
}

interface UserLight {
  idMyUser: number;
  login: string;
}

interface OneActor {
  name: string;
  idNm: string;
  urlImg: string;
  info: string;
}

interface Sort {
  col: string,
  asc: boolean,
}

interface OneFilmpgraphy {
  name: string,
  idNm: string,
  urlImg: string,
  filmo: Filmlight[],
  oneFilter: Filter,
  sort: Sort,
}

interface ResultFilmLight {
  name: string,
  filmo: Filmlight[],
  sort: Sort,
}

interface Filter {
  sizefilmowithfilter: number;
  isfilter: boolean;
  showfilter: boolean,
  yearmin: number,
  yearmax: number,
  yearmaynull: boolean,
  scoremin: number,
  scoremax: number,
  scoremaynull: boolean,
  oneRole: Role,
  isnotappeared: boolean,
  andnot: boolean,
  title: string,
  titltechoice: number
}

interface Role {
  roleactor: boolean,
  rolewriter: boolean,
  roledirector: boolean,
  roleproducer: boolean,
  rolesoundtrack: boolean,
  rolethanks: boolean,
  roleself: boolean
}

interface VideoFilmlight {
  idTt: string,
  actorPos: number,
  score: number
}
interface Filmlight {
  title: string;
  idTt: string;
  infoTitle: string;
  year: number;
  score: number;
  showit: boolean,
  pos: number,

  actor: boolean;
  actorPos: number;
  writer: boolean;
  director: boolean;
  soundtrack: boolean;
  producer: boolean;
  thanks: boolean;
  self: boolean;
  loaded: boolean,

  appeared: boolean;
  lmmi: MyMediaInfo[];
  vus: VideoUserScore;
}

interface LocalBasket {
  selection: boolean,
  localBasketName: string,
  localBasketComment: string,
  localIdsMmi: string[],
  localBasketContent: BasketInfo
}

interface Usr {
  info: string;
  name: string;
  navigator: string;
  state: string;
  tokenLimit: string;
  url: string;
}

interface Basket {
  dateModif: string,
  id: IdBasket,
  basketName: basketName
}

interface basketName {
  basketName: string,
  comment: string,
  idBasketName: number
}

interface IdBasket {
  idBasketName: number,
  idMyMediaInfo: string,
  idMyUser: number
}

interface BasketInfo {
  basketName: string,
  comment: string,
  userId: number,
  basketInfoElements: BasketInfoElement[]
}

interface BasketInfoElement {
  idMmi: string,
  basketInfoPahs: BasketInfoPahs[]
}


interface BasketInfoPahs {
  title: string,
  path: string,
  nameExport: string
}

interface Statescan {
  message: string,
  extentionsNotRead: [],
  extentionsRead: [],
  minSizeOfVideoFile: number,
  pathVideo: string,
  filesRead: []
}

interface Preferences {
  dateModifPref: string,
  extset: string[],
  idPreferences: string,
  minSizeOfVideoFile: number,
  pathIdVideo: string,
  urlAffichiche: string,
  itemToSearches: [],
  prefmap: {}
}

interface MyNameExport {
  active: boolean,
  complete: boolean,
  dateModifNameExport: string,
  idVideoNameExport: number,
  nameExport: string
}

interface FilesReadToExport {
  filePath: string,
  state: number
}
interface InfoWindow{
  idMmi: string,
  nameWindow: string,
  codeName: number,
  status2come: boolean
}
interface jobj{
  key: string,
  value: any
}
interface vnelight {
  idVideoNameExport: number;
  nameExport: string;
}
interface ReqScore{
  idtt:string,
  score: number,
  comment: string
}
interface userLight {
  idMyUser: number;
  login: string;
}
interface langtopost{
  idMd5:string,
  oldLang: string,
  newLlang: string
}

interface myMediaAudio {
  bitrate: number,
  duration: number,
  format: string,
  channels: string,
  forced: boolean,
  myMediaLanguage: MyMediaLanguage
}
interface MyMediaLanguage {
  idLanguage: number
  language: string
}
interface MyMediaText {
  id: object,
  codecId: string,
  format: string,
  internal: boolean,
  myMediaLanguage: MyMediaLanguage
}
