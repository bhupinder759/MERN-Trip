import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { ArrowDown, Globe2, Landmark, Plane, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import blur from "../assets/Ellipse 9.png";
import Footer from "../components/Footer"

const suggestions = [
  {
    title: "Create New Trip",
    icon: <Globe2 className="text-blue-400 h-5 w-5" />,
  },
  {
    title: "Inspire mw where to go",
    icon: <Plane className="text-green-500 h-5 w-5" />,
  },
  {
    title: "Create New Trip",
    icon: <Landmark className="text-orange-500 h-5 w-5" />,
  },
  {
    title: "Create New Trip",
    icon: <Globe2 className="text-yellow-600 h-5 w-5" />,
  },
];

const Home = () => {
  const user = false;
  const navigate = useNavigate();

  const onSend = () => {
    console.log("Send button clicked");
    if (!user) {
      navigate("/sign-in");
      return;
    }
    // Navigate to Create Trip planner Web page
    navigate("/create-new-trip");
  };

  return (
    <>
      <div className="mt-24 relative top-27 flex flex-col justify-center w-full h-auto bg-background">
        <img
          src={blur}
          className="absolute top-[-50%] left-[30%] h-200 w-200 z-1"
        />
        <img
          src={blur}
          className="absolute top-[20%] left-[-35%] h-200 w-200 -z-0"
        />

        {/* Content */}
        <div className="max-w-3xl mx-auto flex flex-col items-center px-6 text-center">
          <h1 className="text-xl md:text-5xl font-bold">
            Hey, I'm your personal{" "}
            <span className="text-primary">AI Trip Planner</span>
          </h1>
          <p className="text-lg">
            Tell me what you want, and I'll handle the rest: Flights, Hotels,
            trip Planner - all in seconds
          </p>
          {/* Input Box */}
          <div className="w-full">
            <div className="border rounded-2xl p-4 relative">
              <Textarea
                placeholder="Create a trip for Paris from New York"
                className="w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize"
              />
              <Button
                size={"icon"}
                className="absolute bottom-6 right-6"
                onClick={() => onSend()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Suggestion list */}
        <div className="flex gap-5 items-center justify-center mt-5">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-center gap-2 border rounded-full p-2 cursor-pointer hover:bg-primary hover:text-white"
            >
              {suggestion.icon}
              <h2 className="text-sm">{suggestion.title}</h2>
            </div>
          ))}
        </div>

        {/* Video Section */}
        <div className="flex items-center justify-center flex-col">
          <h2 className="my-7 mt-14 flex gap-2 text-center">
            Not Sure where to start? <strong>See how it works</strong>{" "}
            <ArrowDown />
          </h2>
          {/* <HeroVideoDialog
          className="block dark:hidden"
          animationStyle="from-center"
          videoSrc="https://www.example.com/dummy-video"
          thumbnailSrc="https://mma.prnewswire.com/media/2204649/ai_trip_planner_hero_thumbnail.jpg?p=facebook"
          thumbnailAlt="Dummy Video Thumbnail"
        /> */}
        </div>

        {/* second section */}
        <section className="relative w-full flex items-center justify-center bg-transparent ">
          <div className="max-w-7xl p-6 lg:px-8">
            <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 shadow-2xl rounded-2xl sm:rounded-3xl sm:px-24 xl:py-32">
              <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Keep Updated
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-gray-300">
                Keep pace with SecureCloud advancements! Join our mailing list
                for selective, noteworthy updates.
              </p>

              <form className="mx-auto mt-10 flex max-w-md gap-x-4">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
                  placeholder="Enter your email"
                />

                <button
                  type="submit"
                  className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Notify me
                </button>
              </form>

              {/* If the SVG is decorative, ensure it's accessible. */}
              <svg
                viewBox="0 0 1024 1024"
                className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2"
                aria-hidden="true"
              >
                <circle
                  cx="512"
                  cy="512"
                  r="512"
                  fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
                  fillOpacity="0.7"
                />
                <defs>
                  <radialGradient
                    id="759c1415-0410-454c-8f7c-9a820de03641"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(512 512) rotate(90) scale(512)"
                  >
                    <stop stopColor="#7775D6" />
                    <stop offset="1" stopColor="#7ED321" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Home;
