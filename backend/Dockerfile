FROM public.ecr.aws/lambda/nodejs:20 AS base

COPY package*.json ${LAMBDA_TASK_ROOT}/

RUN npm ci --omit=dev

COPY . ${LAMBDA_TASK_ROOT}/

CMD [ "server.handler" ]