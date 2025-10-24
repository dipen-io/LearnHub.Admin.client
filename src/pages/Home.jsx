import useAuthStore from "../context/useAuthContext";

const HomePage = () => {
    const {token, user} = useAuthStore();
    console.log(token, user)

    return (
      <>
        <div className="flex">
            <div className="px-20 py-10">
                <h1> HELLO HOME PAGE </h1>
            </div>
        </div>
      </>
    )
}

export default HomePage;
