.DEFAULT_GOAL := help

up:
	docker-compose up -d --build

down:
	docker-compose down

logs:
	docker-compose logs -f web

dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

test:
	npm run test:coverage
