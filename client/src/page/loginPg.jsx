import { io } from "socket.io-client"
const socket = io("http://localhost:5174")

export default function () {
    function handlerLogin(e) {
        e.preventDefault();

        // Read the form data
        const formData = new FormData(e.target)
        const formJson = Object.fromEntries(formData.entries())

        socket.emit('login', formJson.user, formJson.pass, (res) => {
            if (res.status != "null") {
                sessionStorage.setItem("user", res.status)
                location.replace("/chats")
            }
        });
    }

    return (
        <>
            <div className="flex min-h-full flex-col justify-center items-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
                </div>

                <form method="post" onSubmit={handlerLogin} className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="text" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
                            <div className="mt-2">
                                <input id="text" type="text" autoComplete="text" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" name="user" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                            </div>
                            <div className="mt-2">
                                <input id="password" type="password" autoComplete="current-password" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" name="pass" />
                            </div>
                        </div>

                        <div>
                            <button className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" type="submit">Sign in</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}