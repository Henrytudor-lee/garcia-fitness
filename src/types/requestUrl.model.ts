export enum RequestUrl {
  Wiki_Muscles = "/api/proxy/newapi/muscle/muscles",
  Wiki_Equipments = "/api/proxy/newapi/exercise/categories?enable=true",
  Wiki_Directory = "/api/proxy/newapi/exercise/exercises/directory",
  Wiki_Search = "/api/proxy/api/search/exercises/suggest",

  Start_Session = "/api/session/start",
  Terminate_Session = "/api/session/terminate",
  
  Create_Exercise = "/api/exercise/create",
  Get_Exercise_List = "/api/exercise/list",
  Get_Exercise_Detail = "/api/exercise/detail",
  Update_Exercise = "/api/exercise/update",
  Delete_Exercise = "/api/exercise/delete",

  Get_Last_Running_Session = "/api/session/getLastRunningSession",
  Get_History_By_Date = "/api/session/getHistoryByDate",
}
