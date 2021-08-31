const middleware = {
	role: (roles = []) => (req, res, next) => {
		const user = req.user;

		if (!user) return next(403);

		if (typeof roles === "string") {
			roles = [roles];
		}

		if (roles.length > 0 && !roles.includes(user.role)) return next(403);

		next()
	}
}

module.exports = middleware;
