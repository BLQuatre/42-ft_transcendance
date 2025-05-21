import { redirect } from "next/navigation"

export default function NotFound() {

	// Here we have to redirect to the selected language
	redirect("/en/not-found")
}
