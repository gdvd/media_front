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
  textCount: number,
  typeMmi: TypeMmi,
  videoSupportPaths: VideoSupportPaths[],
  myMediaAudios: MyMediaAudio[],
  myMediaComments: MyMediaComment[],
  myMediaTexts: MyMediaText[],
  myMediaVideos: [],
  myressearch: ResultSearch[]
}
interface MyMediaInfoLight {
  state: number,
  editTypeName: number,
  search: number,
  idVideo: string,
  format: string,
  codecId: string,
  fileSize: number,
  duration: number,
  height: number,
  width: number,
  bitrate: number,
  textCount: number,
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

interface MyPageVideo {
  content: VideoFilmWithIdmmi[];
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

interface VideoFilm {
  idVideo: string,
  dateModifFilm: string,
  duration: number,
  nbOfVote: number,
  scoreOnHundred: number,
  year: number,
  fkVideoSourceInfo: string,
  fkRemake: number,
  videoComment: VideoComment,
  videoCountries: VideoCountry[],
  videoTitles:VideoTitle[],
  videoPosters: VideoPoster[],
  videoFilmArtists: VideoFilmArtist[],
  videoKeyWordSet: VideoKeyword[],
  typeMmis: TypeMmi[];
}
interface VideoFilmWithIdmmi {
  idVideo: string,
  dateModifFilm: string,
  duration: number,
  nbOfVote: number,
  scoreOnHundred: number,
  year: number,
  fkVideoSourceInfo: string,
  fkRemake: number,
  videoKinds: VideoKind[],
  videoComment: VideoComment,
  videoCountries: VideoCountry[],
  videoTitles:VideoTitle[],
  videoPosters: VideoPoster[],
  videoFilmArtists: VideoFilmArtist[],
  videoKeywordSet: VideoKeyword[],
  videoUserScores: VideoUserScore[],
  idmmi: string[],
  typeMmi: TypeMmi,
  videoMoreInformation: VideoMoreInformation,
  videoResumes: VideoResume[],
}
interface VideoResume{
  dateModifResume: string,
  idResume: number,
  textResume: string
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
interface VideoFilmArtists {
  idTypeMmi: number,
  season: number,
  episode: number,
  nameSerie: string,
  nameSerieVO: string,
  active: boolean,
}
interface VideoSupportPaths {
  active: boolean;
  dateModif: string;
  id: Idvsp;
  id_video_name_export: number;
  pathGeneral: string;
  title: string;
  type: string
  vneName: string,
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
  id: IdsAudio,
  myMediaLanguage: MyMediaLanguage
}
interface IdsAudio{
  idMyMediaInfo: string,
  idLanguage: number
}
interface MyMediaText {
  id: IdsText,
  codecId: string,
  format: string,
  internal: boolean,
  myMediaLanguage: MyMediaLanguage
}
interface IdsText{
  idMyMediaInfo: string,
  idMyMediaLanguage: number
}
interface MyMediaLanguage {
  idLanguage: number
  language: string
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
interface listIdVneToName{

}
interface TypeName {
  idTypeName: number,
  typeName: string,
  state: boolean,
  typeMmis: TypeMmi[]
}
interface LinkVfTmmi {
  link: number;
  vf: VideoFilms;
}
interface LinkIdvfMmi {
  idVideo: string,
  lmmi: MyMediaInfo[],
}
interface LinkMmiVf {
  lmmi: MyMediaInfo[];
  llvftmmi: LinkVfTmmi[];
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
  ulrImg: string
}

interface VideoKind {
  /* * * * * * * * * *
  * state=1 -> isInListActive(kindStr)
  * state=2 -> isInactive
  * state=3 -> isInListNotactive(kindNotStr)
  * * * * * * * * * */
  idKind: number,
  kindEn: string,
  kindFr: string,
  state: number,
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
  idKeyword: number,
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
  idVideoNameExport: number,
  nameExport: string,
  state: boolean,
}

interface UserLight {
  idMyUser: number;
  login: string;
}
interface UserLightAnsSel {
  idMyUser: number;
  login: string;
  active: boolean
}

interface UserLightWithScore {
  idMyUser: number;
  login: string;
  used: boolean;
  scoreMin: number;
  scoreMax: number;
  scoreMayNull: boolean;
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

interface UsertoSort{
  user: string,
  id: number,
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
  usr:string,
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

interface filteronesearch{
  title: string,
  name: string,
  language_origin: string,
  country: string,
  keyword: string
}
interface filteryear {
  year_min: number,
    year_max: number,
    year_null: boolean,
}
interface filtertype{
  type_video_exact: string,
  type_saison_min: number,
  type_saison_max: number,
  type_episode_min: number,
  type_episode_max: number
}
interface filteruserscore {
  user_name: string,
  user_score_min: number,
  user_score_max: number,
  score_null: boolean,
}
interface filterorderby {
  title: number,
  name: number,
  language: number,
  keyword: number,
  kind: number,
  country: number,
  typename: number,
  typeseason: number,
  typeepisode: number,
  score: number,
  year: number,
  support: number
}
interface map {
  key: string,
  value: string
}
interface RequestVideo{
  title: string,
  keyword: number,
  nameSerie: string,
  country: string,
  keywordSerie: number,
  keywordsStr: string,
  keywordfilm: string,
  keywordSel: number,

  charError: number,
  pageSize: number,
  pageNumber: number,
  scoreMin: number,
  scoreMax: number,
  scoreMayNull: boolean,
  yearMin: number,
  yearMax: number,
  durationMin: number,
  durationMax: number,
  widthMin: number,
  widthMax: number,
  yearMayNull: boolean,
  seasonMin: number,
  seasonMax: number,
  episodeMin: number,
  episodeMax: number,
  listType: number[],
  userLightWithScore: UserLightWithScore[],
  roleList: Roles,
  keywordNameIsSel: number,
  keywordCountryIsSel: number,
  charErrorNameIsSel: number,
  nameArtist: string,
  importStr: string,
  kindStr: string,
  kindNotStr: string,
  languagesStr: string,

  sortBy: string,
  ascending: boolean,
  reqTitleScoreYear: boolean,
  reqTypeEpisodeSeason: boolean,
  reqImportSupportwidthSize: boolean,
  reqNameandroles: boolean,
  reqKeywordKindCountry: boolean,
  reqDurationWidthLanguage: boolean,

}
interface Roles {
  actor :boolean;
  director :boolean;
  music :boolean;
  producer :boolean;
  writer :boolean;
}
interface optionGetMmiWithIdVf{
  lidvf: string [],

  withOptionL1: boolean,
  seasonMin: number,
  seasonMax: number,
  episodeMin: number,
  episodeMax: number,
  nameSerie: string,
  keywordSerie: number,

  withOptionL2: boolean,
  importStr: string,
  languagesStr: string,

  withOptionL3: boolean,
  durationMin: number,
  durationMax: number,
  widthMin: number,
  widthMax: number,
}
interface NewLanguage{
  language: string,
  idMmiInEdition: string,
  idLanguageInEdition: number
}
interface SubmitSerie{
  season: number,
  episode: number,
  nameSerieVo: string,
  idMyMediaInfo: string,
  idTypemmi: number,
}
interface KeywordAndVFSize{
  keywordEn: string,
  idKeyword: number,
  vfsize: number,
}
interface MyMediaLanguageAndNbMmi{
  idLanguage: number,
  language: string,
  nbMmi: number,
}
interface artist{
  name: string,
  number: number,
  visible: boolean,
  idArtist: string,
}
interface BasketNameUser {
  basketName: string,
  size: number,
  active: boolean,
  limportuser: ImportUser[],
}
interface ImportUser{
  nameVne: string,
  size: number,
  active: boolean,
  lmmiuser: MmiUser[]
}
interface MmiUser{
  path: string,
  title: string,
  idmmi: string,
  size: number,
  active: boolean,
}
