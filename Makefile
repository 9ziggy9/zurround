TSX_FLAGS=--listEmittedFiles --listFiles
TSX_CMD=npx tsc
BUILD_DIR=./dist
SRV_CMD=python3 -m http.server 1337 --directory

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

build:
	$(call print_in_color, $(GREEN), MAKE: compiling tsx...\n)
	$(call print_in_color, $(YELLOW), >> CMD: $(TSX_CMD)\n)
	@$(TSX_CMD)
	cp ./index.html $(BUILD_DIR)
	cp ./style.css $(BUILD_DIR)

run: build
	$(call print_in_color, $(GREEN), MAKE: BUILD SUCCESS ...\n)
	$(call print_in_color, $(GREEN), MAKE: starting server ...\n)
	$(SRV_CMD) $(BUILD_DIR)

clean:
	$(call print_in_color, $(YELLOW), MAKE: Cleaning ...\n)
	rm -rf ./dist
