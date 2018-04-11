<template>
    <div v-if='manager'>
        <div v-if='resource !== 0 && resource !== null'>

            <div class='page-row'>
                <div class='flex-fill content'>
                    <div class='section-inner container-fields' v-bind:class="{ 'container-fields-editing': editing}">

                        <h1>{{ config.title }} #{{ resource.id }}</h1>

                        <div v-if='errors.length > 0'>
                            <br>
                            <ul  class='alert alert-danger'>
                                An error has occurred<br>
                                <span v-for='error in errors'>
                                    - <b>{{ error.label }}</b>: {{ error.message }}<br>
                                </span>
                            </ul>
                        </div>
                        <div v-if='!editing'>

                            <div class='button-edit'>
                                <button class='btn btn-sm btn-primary' v-on:click="$router.go(-1)"><i class='fa fa-list'></i></button>
                                <button class='btn btn-sm btn-danger' v-b-modal.delete v-if="config.remove === true"><i class='fa fa-trash'></i></button>
                                <button class='btn btn-sm btn-primary' v-on:click="editing = true" v-if="config.update === true"><i class='fa fa-pencil-alt'></i></button>
                            </div>
                            <slot name='show' v-bind:getAttribute="getAttribute" v-bind:resource="resource" v-bind:errors="errors"></slot>
                        </div>
                        <div v-if='editing'>
                            <div class='fix-spacing'></div>
                            <div class='button-edit' >
                                <button class='btn btn-sm btn-primary' v-on:click="save()"><i class='fa fa-save'></i></button>
                                <button class='btn btn-sm btn-primary' v-on:click="editing = false"><i class='fa fa-times'></i></button>

                            </div>

                            
                            <slot name='edit' v-bind:getAttribute="getAttribute" v-bind:resource="resource" v-bind:errors="errors"></slot>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <b-modal id="delete" ref="delete" hide-footer :title="$t('removing')">
            <div class="d-block text-center">
                <p>{{ $t('irreversible_operation')}} <br><br>{{ $t('are_you_sure')}}</p>
            </div>
            <b-btn class="mt-3" variant="outline-danger" block @click="hideModal(); remove();">{{ $t('yes')}}</b-btn>
            <b-btn class="mt-3" variant="outline-primary" block @click="hideModal(); ">{{ $t('no')}}</b-btn>
        </b-modal>
        <div v-if='resource === 0'>
            <div class='page-row'>
                <div class='page-section'>
                    <div class='section-inner text-center'>
                        <br>
                        <h1>Risorsa non trovata</h1>
                        <img src='https://i.pinimg.com/originals/09/4c/fd/094cfdfce64c317a2c071756cd332ff8.gif'>
                    </div>
                </div>
            </div>
        </div>
        <div class="spinner" v-if='resource === null'></div>
    </div>
</template>

<script>

import { ResourceEdit } from '../../mixins/ResourceEdit'


export default {
    props: ['config'],
    mixins: [ ResourceEdit ],
    created() {

        this.manager = this.config.manager;
        this.attributes = this.config.attributes;
    }
}

</script>