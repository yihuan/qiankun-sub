import { BASE_URL } from '@/request/http'

export default {
  list: BASE_URL + 'sgtemplate/getTemplateListByPage',
  create: BASE_URL + 'sgtemplate/addTemplate',
  copy: BASE_URL + 'sgtemplate/copyTemplate', // TODO: to be updated with real one
  delete: BASE_URL + 'sgtemplate/delete',
  details: BASE_URL + 'sgtemplate/getTemplateDetail',
  rename: BASE_URL + 'sgtemplate/rename',
  createTask: BASE_URL + 'sgtemplate/addTemplateStepAttr',
  createStage: BASE_URL + 'sgtemplate/addTemplateStep'
}
