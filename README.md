multiple-role-service-app



{
  "expo": {
    "name": "bolt-expo-nativewind",
    "slug": "bolt-expo-nativewind",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.bharatpratapsingh0802.boltexponativewind"
    },
    "web": {
      "bundler": "metro",
      "output": "single",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-font"
    ],
    "experiments": {
      "typedRoutes": true
    },
    "android": {
      "package": "com.bharatpratapsingh0802.boltexponativewind"
    },
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "ac90122f-f2f5-4d5c-b6b4-d02ed82e7ec8"
      }
    },
    "owner": "bharatpratapsingh0802"
  }
}


