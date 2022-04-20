export type AmplifyDependentResourcesAttributes = {
    "auth": {
        "photosharing43c2d6ce": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    },
    "api": {
        "photoapp": {
            "GraphQLAPIIdOutput": "string",
            "GraphQLAPIEndpointOutput": "string"
        }
    },
    "storage": {
        "photos": {
            "BucketName": "string",
            "Region": "string"
        }
    }
}