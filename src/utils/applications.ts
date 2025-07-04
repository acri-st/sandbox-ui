import { IApplication } from '@desp-aas/desp-ui-fwk/src/utils/types';
import pytorchImage from './application_images/pytorch.png';
import tensorflowImage from './application_images/tensorflow.png';

export const APPLICATIONS: IApplication[] = [
    {
        id: "PyTorch",
        icon: pytorchImage,
        name: "PyTorch",
        description: "Pytorch is an optimized tensor library for deepusing GPUs and CPUs"
    },
    {
        id: "TensorFlow",
        icon: tensorflowImage,
        name: "TensorFlow",
        description: "An end-o-end open source machine learning platform"
    },
]

export const DEFAULT_SOFTWARE = [
    "Git", "Docker", "cURL", "Minikube", "Python & Python lib", "Keycloak"
    // "Git", "Docker", "cURL", "Minikube", "Visual Studio code", "Python & Python lib", "Postman"
]