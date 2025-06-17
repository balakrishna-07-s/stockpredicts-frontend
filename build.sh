#!/bin/bash

echo "Installing with legacy-peer-deps..."
npm install --legacy-peer-deps

echo "Running build..."
npm run build
