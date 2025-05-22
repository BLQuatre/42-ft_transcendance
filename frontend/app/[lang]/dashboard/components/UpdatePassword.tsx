"use client"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { useDictionary } from "@/hooks/UseDictionnary"
import { toast } from "@/hooks/UseToast"
import api from "@/lib/api"
import { cn } from "@/lib/utils"
import { useState } from "react"

export default function UpdatePassword() {
	const [currentPassword, setCurrentPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")

	const [passwordError, setPasswordError] = useState<string | null>(null)
	const [newPasswordError, setNewPasswordError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)


	const dict = useDictionary()
	if (!dict) return null

	const handleCurrentPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCurrentPassword(event.target.value)
		setPasswordError(null)
	}

	const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const password = event.target.value
		setNewPassword(password)

		if (password.length < 8) {
			setNewPasswordError("8 characters minimum");
		} else {
			setNewPasswordError(null);
		}

		if (password !== confirmPassword && password.length > 0 && confirmPassword.length > 0) {
			setNewPasswordError("Passwords do not match");
		} else {
			setNewPasswordError(null);
		}
	}

	const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const password = event.target.value
		setConfirmPassword(password)

		if (password !== newPassword && newPassword.length > 0 && password.length > 0) {
			setNewPasswordError("Passwords do not match");
		} else {
			setNewPasswordError(null);
		}
	}

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setIsLoading(true)

		const userId = sessionStorage.getItem("userId")

		console.log("Update password submitted");
		console.log("userId: " + userId)

		console.log("verifying current password...")
		try {
			await api.post(`/user/confirmpassword/${userId}`, {
				password: currentPassword
			})

			await api.put(`/user/password/${userId}`, {
				password: newPassword
			})

			toast({
				title: "Password Updated",
				description: "Your password has been updated successfully",
				duration: 3000,
			})

		} catch (error: any) {
			if (error.status == 401) {
				setPasswordError("Wrong current password")
			} else if (error.status == 400) {
				setNewPasswordError("Cannot be the same as the current password")
			} else {
				console.error("Error: " + JSON.stringify(error))
			}
		} finally {
			setIsLoading(false)
		}
	}

	return (
	<Card>
		<CardHeader>
			<CardTitle className="font-pixel text-sm uppercase">
				{dict.dashboard.sections.settings.security.password.title}
			</CardTitle>
			<CardDescription className="font-pixel text-xs uppercase">
				{dict.dashboard.sections.settings.security.password.description}
			</CardDescription>
		</CardHeader>
		<CardContent className="space-y-4">
			<form onSubmit={onSubmit} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="currentPassword" className="font-pixel text-xs uppercase">
						{dict.dashboard.sections.settings.security.password.current}
					</Label>
					<Input
						id="currentPassword"
						name="currentPassword"
						type="password"
						autoComplete="current-password"
						value={currentPassword}
						onChange={handleCurrentPasswordChange}
						error={passwordError !== null}
						required
						className="font-pixel text-sm h-10 bg-muted"
					/>
					<p className={cn("font-pixel text-xs text-red-500 mt-1", passwordError ? "" : "select-none")}>{passwordError || " "}</p>
				</div>
				<div className="space-y-2">
					<Label htmlFor="newPassword" className="font-pixel text-xs uppercase">
						{dict.dashboard.sections.settings.security.password.new}
					</Label>
					<Input
						id="newPassword"
						name="newPassword"
						type="password"
						autoComplete="new-password"
						value={newPassword}
						onChange={handleNewPasswordChange}
						error={newPasswordError !== null}
						required
						className="font-pixel text-sm h-10 bg-muted"
					/>
					<p className={cn("font-pixel text-xs text-red-500 mt-1", newPasswordError ? "" : "select-none")}>{newPasswordError || " "}</p>
				</div>
				<div className="space-y-2">
					<Label htmlFor="confirmPassword" className="font-pixel text-xs uppercase">
						{dict.dashboard.sections.settings.security.password.confirm}
					</Label>
					<Input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						autoComplete="new-password"
						value={confirmPassword}
						onChange={handleConfirmPasswordChange}
						error={newPasswordError !== null}
						required
						className="font-pixel text-sm h-10 bg-muted"
					/>
					<p className={cn("font-pixel text-xs text-red-500 mt-1", newPasswordError ? "" : "select-none")}>{newPasswordError || " "}</p>
				</div>
				<Button
					type="submit"
					className="font-pixel bg-game-blue hover:bg-game-blue/90 uppercase"
					disabled={isLoading}
				>
					{isLoading ? dict.common.updating : dict.dashboard.sections.settings.security.password.update}
				</Button>
			</form>
		</CardContent>
	</Card>
	)
}
