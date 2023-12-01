TSX_CMD=npx tsc
SRV_CMD=python3 -m http.server --directory ./dist

# COLOR ALIASES
RED=\033[31m
GREEN=\033[32m
YELLOW=\033[33m
BLUE=\033[34m
MAGENTA=\033[35m
CYAN=\033[36m
RESET=\033[0m

# Colored output function
define print_in_color
	@printf "$1"
	@printf "$2"
	@printf "\033[0m"
endef

run: build
	$(call print_in_color, $(GREEN), MAKE: BUILD SUCCESS ...)
	$(call print_in_color, $(GREEN), MAKE: starting server ...)
	$(SRV_CMD)

build:
	$(call print_in_color, $(GREEN), MAKE: compiling tsx...)
	$(TSX_CMD)

clean:
	rm -rf ./dist
