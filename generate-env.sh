#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_colored() {
	local color=$1
	local message=$2
	echo -e "${color}${message}${NC}"
}

generate_production_env() {
	print_colored $YELLOW "Generating default production .env file..."

	cat > .env << 'EOF'
DB_HOST=postgres
DB_USER=user
DB_PASSWORD=very_secure_password
DB_POSTGRES=transcendance
DB_PORT=5432

JWT_ACCESS=jwt_access
JWT_REFRESH=jwt_refresh

COOKIE_SECRET=cookie_secret

FRONTEND_HOST=frontend
FRONTEND_PORT=3000

# Gateway
GATEWAY_HOST=gateway
GATEWAY_PORT=3001

# Services
AUTH_HOST=auth_service
AUTH_PORT=3002

CHAT_HOST=chat_service
CHAT_PORT=3004

FRIEND_HOST=friend_service
FRIEND_PORT=3003

USER_HOST=user_service
USER_PORT=3005

CHATG_HOST=general_chat_service
CHATG_PORT=3006

GAMEH_HOST=game_history_service
GAMEH_PORT=3007

PONG_HOST=pong_service
PONG_PORT=3008

DINO_HOST=dino_service
DINO_PORT=3009

MATCHMAKING_HOST=matchmaking_service
MATCHMAKING_PORT=3010

DEBUG=false

# For Google Sign-In
# Replace these with your own secure values
# You can generate these from the Google Developer Console
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
EOF

	print_colored $YELLOW "  → Please ensure to update the GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET with your own secure values."
	print_colored $YELLOW "  → This are example environment values, you should replace them with your own."
	print_colored $GREEN "✓ Production .env file generated successfully!"
}

generate_development_env() {
	print_colored $YELLOW "Generating development .env.dev file..."

	cat > .env.dev << 'EOF'
DB_HOST=localhost
DB_USER=user
DB_PASSWORD=very_secure_password
DB_POSTGRES=transcendance
DB_PORT=5432

JWT_ACCESS=jwt_access
JWT_REFRESH=jwt_refresh

COOKIE_SECRET=cookie_secret

FRONTEND_HOST=localhost
FRONTEND_PORT=3000

# Gateway
GATEWAY_HOST=localhost
GATEWAY_PORT=3001

# Services
AUTH_HOST=localhost
AUTH_PORT=3002

CHAT_HOST=localhost
CHAT_PORT=3003

FRIEND_HOST=localhost
FRIEND_PORT=3004

USER_HOST=localhost
USER_PORT=3005

CHATG_HOST=localhost
CHATG_PORT=3006

GAMEH_HOST=localhost
GAMEH_PORT=3007

PONG_HOST=localhost
PONG_PORT=3008

DINO_HOST=localhost
DINO_PORT=3009

DEBUG=false

# For Google Sign-In
# Replace these with your own secure values
# You can generate these from the Google Developer Console
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
EOF

	print_colored $YELLOW "  → Please ensure to update the GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET with your own secure values."
	print_colored $YELLOW "  → This are example environment values, you should replace them with your own."
	print_colored $GREEN "✓ Production .env file generated successfully!"
}



# Function to show usage information
show_usage() {
	print_colored $BLUE "Usage: $0 [OPTION]"
	echo
	print_colored $YELLOW "Options:"
	print_colored $GREEN "  -p, --prod, --production    Generate .env (Production) file"
	print_colored $GREEN "  -d, --dev, --development    Generate .env.dev (Development) file"
	print_colored $GREEN "  -b, --both                  Generate both files"
	print_colored $GREEN "  -h, --help                  Show this help message"
	echo
	print_colored $YELLOW "Examples:"
	print_colored $BLUE "  $0 --prod                   # Generate production .env file"
	print_colored $BLUE "  $0 --dev                    # Generate development .env.dev file"
	print_colored $BLUE "  $0 --both                   # Generate both files"
	echo
	print_colored $YELLOW "Note: This script requires a command-line option to run."
	echo
}

# Function to handle backup of existing files
backup_existing_file() {
	local file=$1
	if [ -f "$file" ]; then
		local backup_file="${file}.backup.$(date +%Y%m%d_%H%M%S)"
		cp "$file" "$backup_file"
		print_colored $YELLOW "  → Existing $file backed up as $backup_file"
	fi
}

# Parse command line arguments
parse_arguments() {
	case "$1" in
		-p|--prod|--production)
			backup_existing_file ".env"
			generate_production_env
			exit 0
			;;
		-d|--dev|--development)
			backup_existing_file ".env.dev"
			generate_development_env
			exit 0
			;;
		-b|--both)
			backup_existing_file ".env"
			backup_existing_file ".env.dev"
			generate_production_env
			generate_development_env
			exit 0
			;;
		-h|--help)
			show_usage
			exit 0
			;;
		"")
			# No arguments provided, show usage
			print_colored $RED "Error: No option specified."
			echo
			show_usage
			exit 1
			;;
		*)
			print_colored $RED "Error: Unknown option '$1'"
			echo
			show_usage
			exit 1
			;;
	esac
}



# Check if script is being run from the correct directory
if [ ! -f "docker-compose.yml" ]; then
	print_colored $RED "Error: This script must be run from the transcendance project root directory."
	print_colored $YELLOW "Please navigate to the directory containing docker-compose.yml and run the script again."
	exit 1
fi

# Parse command line arguments and run appropriate function
parse_arguments "$1"
