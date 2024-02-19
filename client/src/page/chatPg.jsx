import { io } from "socket.io-client"
import { useEffect, useState, useRef } from "react"

const socket = io.connect("http://localhost:5174")
const user = sessionStorage.getItem("user")

function FriendBar({ user, tableChat, onRoom, userAktif }) {
    // <button onClick={() => onRoom(tableChat)} className={`w-full  py-5 px-9 ${userAktif == tableChat ? "bg-cyan-300" : "bg-cyan-50"}`}>{user}</button>
    return (
        <>
            <button onClick={() => onRoom(tableChat)} className={`w-full flex h-20 py-4 px-6 items-center gap-6 font-title hover:bg-cyan-50 duration-300 ${userAktif == tableChat ? "bg-cyan-50" : "bg-white"}`}>
                <img className="h-full object-contain rounded-full" src="user.jpg" alt="" />
                <h5>{user.toUpperCase()}</h5>
            </button>
            <hr />
        </>
    )
}

export default function () {
    const [friends, setFriends] = useState([])
    const [chatRoom, setChatRoom] = useState([])
    const [userAktif, setUserAktif] = useState({ before: "", now: "" })
    const [cekAddFriend, setCekAddFriend] = useState(false)
    const massage = useRef("")

    function handlerRoom(nameTable) {
        setUserAktif(user => {
            return { before: user.now, now: nameTable }
        })

        socket.emit('rooms', userAktif.before, nameTable, (res) => {
            setChatRoom(res)
        });
    }

    function handlerMassage() {
        if (userAktif.now) {
            socket.emit('sendChat', user, massage.current.value, userAktif.now, (res) => {
                setChatRoom(res)
                massage.current.value = ""
            });
        }
    }

    useEffect(() => {
        socket.emit('friend', user, (res) => {
            const friendArr = res.map((index) => {
                if (index.user1 != user) {
                    return { user1: index.user2, user2: index.user1, table_chat: index.table_chat }
                }
                return index
            })
            setFriends(friendArr)
        });
    }, []);

    useEffect(() => {
        socket.on("reciveChat", (data) => {
            //   setMessageReceived(data.message);
            setChatRoom(data)
        });
    }, [socket]);

    return (
        <div className="flex h-screen">
            <div className="w-1/5">
                <div className="flex h-32 p-6 items-center bg-cyan-600 text-white">
                    <img className="h-full object-contain rounded-full" src="user.jpg" alt="" />
                    <div className="ml-6">
                        <h1 className="font-body text-2xl mb-3 font-bold">JOKO</h1>
                        <div className="flex items-center font-body gap-2">
                            <i className="fi fi-rr-clock-three text-sm"></i>
                            <h5>Aktif</h5>
                        </div>
                    </div>
                    <i className="ml-auto mr-1 text-2xl fi fi-rr-exit" onClick={() => {
                        sessionStorage.setItem("user", "")
                        location.replace("/login")
                    }}></i>
                </div>
                <button className="text-center w-full py-2 font-title bg-cyan-800 shadow-lg text-white">
                    FIND FRIEND
                </button>
                <div className="overflow-y-scroll h-4/5">
                    {friends.map((index, e) => {
                        return (
                            <li key={e}>
                                <FriendBar user={index.user2} tableChat={index.table_chat} onRoom={handlerRoom} userAktif={userAktif.now} />
                            </li>

                        )
                    })}

                    {/* <div className={`flex h-20 py-4 px-6 items-center gap-6 font-title`}>
                        <img className="h-full object-contain rounded-full" src="user.jpg" alt="" />
                        <h5>ANTON</h5>
                    </div>
                    <hr /> */}
                </div>
            </div>
            <div className=" w-4/5 pt-9 flex flex-col shadow-xl">
                <div className="font-mosts px-16 h-5/6 overflow-y-scroll flex flex-col-reverse gap-3">
                    {chatRoom.map((index, i) => {
                        if (index.user == user) {
                            return (
                                <li key={i}>
                                    <div className="flex flex-col w-1/2 ml-auto">
                                        <h1 className="font-title w-max ml-auto mb-1">ME</h1>
                                        <h5 className="bg-gray-100 px-6 py-2 rounded-md font-body text-right break-words w-max ml-auto">{index.text}</h5>
                                    </div>
                                </li>
                            )
                        } else {
                            return (
                                <li key={i}>
                                    <div className="flex gap-3  w-1/2 ">
                                        <img className="h-10 rounded-full object-contain" src="user.jpg" alt="" />
                                        <div className="">
                                            <h1 className="font-title mb-1">{index.user.toUpperCase()}</h1>
                                            <h5 className="font-body break-words px-6 py-2 bg-teal-100 bg-opacity-50 rounded-md">{index.text}</h5>
                                        </div>
                                    </div>
                                </li>
                            )
                        }
                        // return (
                        //     <li key={i}>
                        //         <h1 className={`${index.user == user ? "ml-auto bg-blue-300" : "bg-cyan-300"} chatBubble`}>{index.text}</h1>
                        //     </li>
                        // )
                    })}

                    {/* <div className="flex gap-3">
                        <img className="h-10 rounded-full object-contain" src="user.jpg" alt="" />
                        <div className="">
                            <h1 className="font-title mb-1">JOKO</h1>
                            <h5 className="font-body w-1/2 break-words px-6 py-2 bg-teal-100 bg-opacity-50 rounded-md">Hai jokodddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd</h5>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 w-1/2 ml-auto">
                        <h1 className="font-title w-max ml-auto">ME</h1>
                        <h5 className="bg-gray-100 px-6 py-2 rounded-md font-body text-right break-words">HELLO sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssjoko</h5>
                    </div> */}
                </div>
                <div className="font-mosts h-1/6 px-16 py-6 flex justify-center items-center gap-6">
                    <input ref={massage} className=" w-full px-4 py-2 border border-blue-300 rounded-md" type="text" />
                    <button onClick={handlerMassage} className="px-6 py-2 bg-cyan-800 rounded-md text-white shadow-2xl">Send</button>
                </div>
            </div>
        </div>
    )
}