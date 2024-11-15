export type RequestData = {
  s3ConfigPath: string
  name: string
}

export type ResponseData = {
  conf: {
    dnp_s3_config_path: string
  }
  dag_id: string
  dag_run_id: string
  end_date: null | string
  execution_date: string
  external_trigger: boolean
  logical_date: string
  start_date: null | string
  state: string
}

export async function request(requestData: RequestData): Promise<{ response: Response; data: ResponseData }> {
  const headers = new Headers()
  headers.set('Authorization', 'Basic ' + Buffer.from('airflow:airflow').toString('base64'))
  headers.set('Content-Type', 'application/json;charset=UTF-8')

  // Trigger the Airflow DAG run
  const response = await fetch(`http://10.4.40.30:8080/api/v1/dags/${requestData.name}/dagRuns`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      conf: {
        dnp_s3_config_path: requestData.s3ConfigPath,
      },
    }),
  })

  const data = await response.json()

  if (!response.ok) throw { data, response: response }

  return data
}

export { request as runDag }
