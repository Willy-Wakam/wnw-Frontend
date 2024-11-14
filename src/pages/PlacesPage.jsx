import { useContext} from "react";
import { Link, /* Navigate */ useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { UserContext } from "../UserContext";

export default function PlacesPage() {
  const { action } = useParams();
  const { addedPlacesList } = useContext(UserContext);

  /* if(redirect && action === "new") {
        return <Navigate to={redirect} />
    }; */

  return (
    <>
      <NavBar />

      <div className="m-6">
        {action !== "new" && (
          <div className="text-center">
            List of all added places <br />
            <Link
              className="bg-primary inline-flex gap-2 py-2 px-4 rounded-lg text-white max-sm:text-sm items-center"
              to={"/account/places/new"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 max-sm:size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add new place
            </Link>
          </div>
        )}
        {action !== "new" && (
          <div className="my-4 lg:mx-20">
            {addedPlacesList?.length > 0 &&
              addedPlacesList?.map((place, index) => (
                <Link
                  to={"/account/places/" + place._id}
                  key={place._id + index}
                  className="flex cursor-pointer bg-gray-100 gap-4 p-4 rounded-lg shadow-md shadow-gray-300 mb-4 max-sm:grid"
                >
                  {place.photos.length > 0 && (
                    <>
                      <div
                        className="grow shrink-0 h-[100px] w-[180px] 2xl:w-[180px] shadow-md shadow-gray-200 object-cover max-sm:w-full max-sm:h-[180px]"
                        key={place._id + index + place._id}
                      >
                        <img
                          src={
                            "https://wnw-api.onrender.com/uploads/" +
                            place.photos[0].newName
                          }
                          alt=""
                          className="h-[-webkit-fill-available] w-[180px] rounded-lg object-cover max-sm:w-full"
                          key={place.id}
                        />
                      </div>
                    </>
                  )}
                  <div className="grow-0 shrink" key={place._id + place._id}>
                    <h2
                      className="text-2xl font-bold"
                      key={place._id + place._id + index}
                    >
                      {place.title}
                    </h2>
                    <p className="text-sm mt-2" key={place._id}>
                      {place.description}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </>
  );
}
