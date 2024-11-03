import { Routes } from '@angular/router';

const imageArrangementMod = () => import('./image-arrangement/image-arrangement.module').then(m => m.ImageArrangementModule);


export const routes: Routes = [
    {
        path: '',
        loadChildren: imageArrangementMod
    }
];
