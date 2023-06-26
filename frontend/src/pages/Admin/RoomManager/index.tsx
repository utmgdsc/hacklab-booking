import { SubPage } from "../../../layouts/SubPage"
import { instance } from "../../../axios"
import { useContext, useEffect, useState } from "react"
import { SnackbarContext } from "../../../contexts/SnackbarContext"
import { Button } from "@mui/material"


export const RoomManager = () => {
  const [rooms, setRooms] = useState<Room[]>([])

  const { enqueue } = useContext(SnackbarContext)

  useEffect(() => {
    instance.get('/rooms')
      .then(res => {
        if (res.status === 200) {
          setRooms(res.data)
        }
      })
  }, [])

  return (
    <SubPage name="Room Manager" maxWidth="xl">
      <Button
        onClick={() => {
          enqueue("Room created");
        }}>
        Create Room
      </Button>
      <Button
        onClick={() => {
          enqueue("Room deleted");
        }}>
        Create Room
      </Button>
      <div>
        {rooms.map(room => (
          <div key={room.friendlyName}>
            {room.friendlyName}
          </div>
        ))}
      </div>
    </SubPage>
  )
}
