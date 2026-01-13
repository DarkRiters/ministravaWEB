.DEFAULT_GOAL := help

init: ## Build images (checks env if needed)
	@docker compose -f docker-compose.dev.yml build

dev: ## Start DEV (Vite + HMR)
	@docker compose -f docker-compose.dev.yml up -d

stop: ## Stop DEV containers
	@docker compose -f docker-compose.dev.yml stop

down: ## Remove DEV containers + volumes
	@docker compose -f docker-compose.dev.yml down -v

shell: ## Enter DEV container shell
	@docker compose -f docker-compose.dev.yml exec -it web sh

logs: ## Tail DEV logs
	@docker compose -f docker-compose.dev.yml logs -f web

test: ## Run tests inside DEV container
	@docker compose -f docker-compose.dev.yml exec web npm run test:coverage

build: ## Build production image
	@docker compose -f docker-compose.prod.yml build

prod: ## Run production container (nginx)
	@docker compose -f docker-compose.prod.yml up -d

prod-stop: ## Stop production container
	@docker compose -f docker-compose.prod.yml stop

prod-down: ## Remove production container
	@docker compose -f docker-compose.prod.yml down

help: ## Show help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
