#!/bin/bash
docker compose version > output.txt 2>&1
docker ps >> output.txt 2>&1
echo "Done" >> output.txt
