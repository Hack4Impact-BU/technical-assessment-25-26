import Hero from "../hero/hero";
import Navbar from "../navbar/navbar";

export default function HomePage() {
	return (
		<div className="bg-[url('/assets/earth.png')] bg-cover bg-center w-full h-screen">
			<Navbar/>
			<Hero/>
		</div>
	)
}

