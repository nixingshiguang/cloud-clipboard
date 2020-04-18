<template>
    <v-hover
        v-slot:default="{ hover }"
    >
        <v-card :elevation="hover ? 6 : 2" class="mb-2">
            <v-card-text class="d-flex">
                <div class="flex-grow-1 mr-2" style="min-width: 0">
                    <div class="title text-truncate text--primary" :title="meta.name">{{meta.name}}</div>
                    <div class="caption">{{meta.size | prettyFileSize}}</div>
                </div>

                <div class="align-self-center text-no-wrap">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" icon color="grey" @click="getFile">
                                <v-icon>{{mdiDownload}}</v-icon>
                            </v-btn>
                        </template>
                        <span>下载</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" icon color="grey" @click="deleteItem">
                                <v-icon>{{mdiClose}}</v-icon>
                            </v-btn>
                        </template>
                        <span>删除</span>
                    </v-tooltip>
                </div>
            </v-card-text>
        </v-card>
    </v-hover>
</template>

<script>
import {
    mdiContentCopy,
    mdiDownload,
    mdiClose,
} from '@mdi/js';

export default {
    name: 'received-file',
    props: {
        meta: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    data() {
        return {
            mdiContentCopy,
            mdiDownload,
            mdiClose,
        };
    },
    methods: {
        getFile() {
            this.$http.get(`/file/${this.meta.cache}`, {responseType: 'arraybuffer'}).then(response => {
                let blobURL = URL.createObjectURL(new Blob([response.data]));
                let cd = response.headers['content-disposition'];
                let el = document.createElement('a');
                el.href = blobURL;
                el.setAttribute('download', decodeURIComponent(cd.substring(cd.indexOf('"') + 1, cd.lastIndexOf('"'))));
                el.click();
                URL.revokeObjectURL(blobURL);
            }).catch(error => {
                if (error.response && error.response.data.msg) {
                    this.$toast(`文件获取失败：${error.response.data.msg}`);
                } else {
                    this.$toast('文件获取失败');
                }
            });

        },
        deleteItem() {
            this.$http.delete(`/revoke/${this.meta.id}`).then(() => {
                this.$http.delete(`/file/${this.meta.cache}`).then(() => {
                    this.$toast(`已删除文件 ${this.meta.name}`);
                }).catch(error => {
                    if (error.response && error.response.data.msg) {
                        this.$toast(`文件删除失败：${error.response.data.msg}`);
                    } else {
                        this.$toast('文件删除失败');
                    }
                });
            }).catch(error => {
                if (error.response && error.response.data.msg) {
                    this.$toast(`消息删除失败：${error.response.data.msg}`);
                } else {
                    this.$toast('消息删除失败');
                }
            });
        },
    },
}
</script>