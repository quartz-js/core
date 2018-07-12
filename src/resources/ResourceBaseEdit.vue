<template>
    <div>
        <div v-if='resource !== 0 && resource !== null'>
            <div class='fluid'>

                <slot name="main" :resource="resource">
                     <div class='page-section paper'>
                        <div class='fluid-fill content relative'>
                            <div class='content' v-bind:class="{ 'container-fields-editing': editing}">

                                <h3>{{ config.title }} #{{ resource.id }}</h3>

                                <div>
                                    <div v-if='errors.length > 0'>
                                        <br>
                                        <ul  class='alert alert-danger'>
                                            An error has occurred<br>
                                            <span v-for='error in errors'>
                                                - <b>{{ error.label }}</b>: {{ error.message }}<br>
                                            </span>
                                        </ul>
                                    </div>
                                    <div v-if='!shouldEdit()'>

                                        <div class='button-edit'>
                                            <button class='btn btn-sm btn-primary' v-on:click="$router.push({name: config.route + '.index'})"><i class='fa fa-list'></i></button>
                                            <slot name="buttons" v-bind:resource="resource"></slot>
                                            <button class='btn btn-sm btn-danger' v-b-modal="'delete-'+config.route" v-if="config.remove === true"><i class='fa fa-trash'></i></button>
                                            <button class='btn btn-sm btn-primary' v-on:click="toEdit(true)" v-if="config.update === true"><i class='fa fa-pencil-alt'></i></button>

                                        </div>
                                        <slot name='show' v-bind:getAttribute="getAttribute" v-bind:resource="resource" v-bind:errors="errors"></slot>
                                    </div>
                                    <div v-if='shouldEdit()'>
                                        <div class='fix-spacing'></div>
                                        <div class='button-edit' >
                                            <button class='btn btn-sm btn-primary' v-on:click="save()"><i class='fa fa-save'></i></button>
                                            <button v-if="!alwaysEdit()" class='btn btn-sm btn-primary' v-on:click="toEdit(false)"><i class='fa fa-times'></i></button>

                                        </div>
                                        
                                        <slot name='edit' v-bind:getAttribute="getAttribute" v-bind:resource="resource" v-bind:errors="errors"></slot>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </slot>

                <slot name="extra" :resource="resource"></slot>
                <slot name="sidebar-right" :resource="resource"></slot>
            </div>

        </div>
        <b-modal :id="'delete-'+config.route" :ref="'delete-'+config.route" hide-footer :title="$t('removing')">
            <div class="d-block text-center">
                <p>{{ $t('irreversible_operation')}} <br><br>{{ $t('are_you_sure')}}</p>
            </div>
            <b-btn class="mt-3" variant="outline-danger" block @click="hideRemoveModal('delete-'+config.route); remove();">{{ $t('yes')}}</b-btn>
            <b-btn class="mt-3" variant="outline-primary" block @click="hideRemoveModal('delete-'+config.route); ">{{ $t('no')}}</b-btn>
        </b-modal>
        <div v-if='resource === 0'>
            <not-found/>
        </div>
        <!--<div class="spinner" v-if='resource === null'></div>-->
    </div>
</template>

<script>

import { ResourceEdit } from 'railken-vue-admin-core/src/mixins/ResourceEdit'
import NotFound from '../components/NotFound'

export default {
    props: ['config'],
    mixins: [ ResourceEdit ],
    components: {
        NotFound
    },
    methods: {
        alwaysEdit() 
        {
            return !this.config.show && this.config.update;
        },
        shouldEdit()
        {
            if (this.alwaysEdit()) {
                return true;
            }

            return this.editing;

        },
        toEdit(flag) {
            this.editing = flag;

            if (this.editing) {
                this.config.onShowEdit(this.resource);
            }
        }
    },
    created() {

        this.manager = this.config.manager;
        this.attributes = this.config.attributes;
    }
}

</script>