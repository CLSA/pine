DESIGN
======

A) answer_device doesn't exist
  A.1) cypress is available
    A.1.i) user launch => send POST to Cypress; get back uuid; create answer_device
    A.1.ii) user abort => n/a (impossible)
    A.1.iii) cypress abort => return 404
    A.1.iv) cypress complete => n/a (impossible)
  A.2) is busy
    A.2.i) user launch => get barcode and uuid from Cypress (status); create answer_device or show busy in Pine UI
    A.2.ii) user abort => n/a (impossible)
    A.2.iii) cyrpess abort => return 404
    A.2.iv) cypress complete => return 404
      
B) answer_device exists
  B.1) cypress is available
    B.1.i) user launch => reload Pine UI
    B.1.ii) user abort => send DELETE to Cypress (404 response); patch answer_device (status=cancelled)
    B.1.iii) cypress abort => n/a (impossible)
    B.1.iv) cypress complete => n/a (impossible)
  B.2) is busy
    B.2.i) user launch => reload Pine UI
    B.2.ii) user abort => send DELETE to Cypress (200 response); patch answer_device (status=cancelled)
    B.2.iii) cypress abort => patch answer_device (status=cancelled) or return 404
    B.3.iv) cypress complete => complete answer_device or return 404



IMPLEMENTATION
==============

launch( <answer_id> )
{
  Pine client sends PATCH to PINE:answer/<answer_id>?action=launch_device
  if( answer_device record exists )
  {
    respond to client with uuid and status (from answer_device record)
  }
  else
  {
    Pine server sends GET to CYPRESS:<device_path>/status
    if( cypress is available )
    {
      Pine server sends POST to CYPRESS:<device_path>
      if( UUID returned )
      {
        respond to client with uuid and status (from cypress)
      }
      else
      {
        respond to client with "cypress error"
      }
    }
    else if( cypress is in progress )
    {
      respond to client with "cypress is busy with another participant"
    }
    else
    {
      respond to client with "cypress is offline"
    }
  }
}

abort( <uuid> )
{
  Client or Cypress sends PATCH to PINE:answer_device/<uuid> (status=cancelled)
  if( answer_device record doesn't exist )
  {
    return 404
  }

  if( role is not cypress )
  {
    server sends DELETE to CYPRESS:<device_path>/<uuid>
  }
  server patches the answer_device record (status=cancelled)
}

complete( <uuid> )
{
  Cypress sends PATCH to PINE:answer/<answer_id> with body { "value": <DEVICE_JSON_OUTPUT> }
  if( answer record doesn't exist )
  {
    return 404
  }
  JSON data is stored to the answer

  for all data files in Cypress
  {
    Cypress sends PATCH to PINE:answer/<answer_id>?filename=<FILENAME> with raw file contents as body
  }

  Cypress sends PATCH to PINE:answer_device/<uuid> with body { "status": "completed" }
  if( answer_device record doesn't exist )
  {
    return 404
  }

  server updates answer_device.status to "completed"
}



API
===

Pine:
  PATCH answer/<answer_id>?action=launch_device returns { "uuid": <uuid>, "status": "in progress" }
  PATCH answer/<answer_id> with body {value:<results_object>}
  PATCH answer/<answer_id>?filename=<FILENAME> with raw file contents as body
  PATCH answer_device/<uuid> with body { "status": "cancelled" } returns 200 or 404
  PATCH answer_device/<uuid> with body { "status": "completed" } returns 200 or 404

Cypress:
  GET <device_path>/status returns { "status": "ready|in progress", ... }
  POST <device_path> with body { "answer_id":, "barcode":, "language":, "interviewer": } returns UUID or 409
  DELETE <device_path>/<uuid> return 200 or 404
