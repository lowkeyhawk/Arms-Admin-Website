import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Dashboard from "./components/Pages/Dashboard";
import Members from "./components/Pages/Members";
import Staff from "./components/Pages/Staff";
import Reports from "./components/Pages/Reports";
import Settings from "./components/Pages/Settings";
import Attendance from './components/Pages/Attendance';
import Payments from "./components/Pages/Payments";
import MembershipPlans from './components/Pages/MembershipPlans';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Navigate to="/login" replace />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route 
					path="/dashboard" 
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					} 
				/>
				<Route 
					path="/members" 
					element={
						<ProtectedRoute>
							<Members />
						</ProtectedRoute>
					} 
				/>

				<Route 
					path="/plans" 
					element={
						<ProtectedRoute>
							<MembershipPlans />
						</ProtectedRoute>
					} 
				/>

				<Route 
					path="/attendance" 
					element={
						<ProtectedRoute>
							<Attendance />
						</ProtectedRoute>
					} 
				/>

				<Route 
					path="/payments" 
					element={
						<ProtectedRoute>
							<Payments />
						</ProtectedRoute>
					} 
				/>

				<Route 
					path="/staff" 
					element={
						<ProtectedRoute>
							<Staff />
						</ProtectedRoute>
					} 
				/>

				<Route 
					path="/reports" 
					element={
						<ProtectedRoute>
							<Reports />
						</ProtectedRoute>
					} 
				/>

				<Route 
					path="/settings" 
					element={
						<ProtectedRoute>
							<Settings />
						</ProtectedRoute>
					} 
				/>
			</Routes>
		</Router>
	);
}

export default App;