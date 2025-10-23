import {users} from "../data/user"

const InstructorPage = () => {
    return (
      <>
        <div className="">
            <div className="w-full px-10 py-7">
                <h1 className="font-bold md:text-2xl"> Users List </h1>
                <h1 className="h-0.5 bg-blue-700"></h1>
            </div>
                <div className="text-center mb-7">
                    <input type="text" placeholder="search here ..." className=" shadow-md
                        md:w-1/2 w-full md:mx-0 mx-2  py-3 bg-white rounded-2xl px-5"/>
                </div>

             <div className="md:space-y-5 md:space-x-5 grid lg:grid-cols-5 md:px-10 grid-cols-1">
                  {users.map((user, idx) => (
                    <div
                      key={idx}
                      className="w-60 shadow-cyan-300 dark:shadow-fuchsia-950 bg-slate-300 dark:bg-blue-700 hover:bg-green-400 hover:text-black text-black dark:text-white rounded p-4 shadow-md transition"
                    >
                      <p className="font-semibold text-lg">{user.name}</p>
                      <p className="text-base">{user.email}</p>
                      <p className="text-base">{user.phone}</p>
                    </div>
                  ))}
            </div>
        </div>
      </>
    )
}

export default InstructorPage;
